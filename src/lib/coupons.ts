export interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (0-100) or fixed amount in paise
  minOrderAmount?: number; // minimum order amount in paise
  maxDiscountAmount?: number; // maximum discount amount in paise
  usageLimit?: number; // total usage limit
  usedCount: number; // current usage count
  validFrom: string; // ISO date string
  validUntil: string; // ISO date string
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  applicableCategories?: string[]; // product categories
  applicableProducts?: string[]; // specific product IDs
}

export interface CouponUsage {
  id: string;
  couponId: string;
  userId: string;
  orderId: string;
  discountAmount: number;
  usedAt: string;
}

class CouponService {
  private readonly STORAGE_KEY = 'coupons';
  private readonly USAGE_STORAGE_KEY = 'coupon_usage';

  // Generate a unique coupon code
  generateCouponCode(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Create a new coupon
  createCoupon(couponData: Omit<Coupon, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>): Coupon {
    const coupon: Coupon = {
      ...couponData,
      id: `coupon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      usedCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const coupons = this.getAllCoupons();
    coupons.push(coupon);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(coupons));
    
    return coupon;
  }

  // Get all coupons
  getAllCoupons(): Coupon[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Get active coupons
  getActiveCoupons(): Coupon[] {
    const now = new Date().toISOString();
    return this.getAllCoupons().filter(coupon => 
      coupon.isActive && 
      coupon.validFrom <= now && 
      coupon.validUntil >= now
    );
  }

  // Get coupon by code
  getCouponByCode(code: string): Coupon | null {
    const coupons = this.getAllCoupons();
    return coupons.find(coupon => coupon.code.toUpperCase() === code.toUpperCase()) || null;
  }

  // Validate coupon for an order
  validateCoupon(code: string, orderAmount: number, userId?: string): { valid: boolean; coupon?: Coupon; error?: string } {
    const coupon = this.getCouponByCode(code);
    
    if (!coupon) {
      return { valid: false, error: 'Invalid coupon code' };
    }

    if (!coupon.isActive) {
      return { valid: false, error: 'Coupon is not active' };
    }

    const now = new Date().toISOString();
    if (coupon.validFrom > now) {
      return { valid: false, error: 'Coupon is not yet valid' };
    }

    if (coupon.validUntil < now) {
      return { valid: false, error: 'Coupon has expired' };
    }

    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return { valid: false, error: `Minimum order amount of ₹${coupon.minOrderAmount / 100} required` };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, error: 'Coupon usage limit exceeded' };
    }

    return { valid: true, coupon };
  }

  // Calculate discount amount
  calculateDiscount(coupon: Coupon, orderAmount: number): number {
    let discount = 0;

    if (coupon.type === 'percentage') {
      discount = Math.round((orderAmount * coupon.value) / 100);
    } else {
      discount = coupon.value;
    }

    // Apply maximum discount limit
    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }

    // Ensure discount doesn't exceed order amount
    return Math.min(discount, orderAmount);
  }

  // Use coupon
  useCoupon(couponId: string, userId: string, orderId: string, discountAmount: number): CouponUsage {
    const usage: CouponUsage = {
      id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      couponId,
      userId,
      orderId,
      discountAmount,
      usedAt: new Date().toISOString(),
    };

    // Save usage record
    const usages = this.getCouponUsages();
    usages.push(usage);
    localStorage.setItem(this.USAGE_STORAGE_KEY, JSON.stringify(usages));

    // Update coupon usage count
    const coupons = this.getAllCoupons();
    const couponIndex = coupons.findIndex(c => c.id === couponId);
    if (couponIndex !== -1) {
      coupons[couponIndex].usedCount++;
      coupons[couponIndex].updatedAt = new Date().toISOString();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(coupons));
    }

    return usage;
  }

  // Get coupon usage history
  getCouponUsages(): CouponUsage[] {
    const stored = localStorage.getItem(this.USAGE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Update coupon
  updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const coupons = this.getAllCoupons();
    const couponIndex = coupons.findIndex(c => c.id === id);
    
    if (couponIndex === -1) {
      return null;
    }

    coupons[couponIndex] = {
      ...coupons[couponIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(coupons));
    return coupons[couponIndex];
  }

  // Delete coupon
  deleteCoupon(id: string): boolean {
    const coupons = this.getAllCoupons();
    const filteredCoupons = coupons.filter(c => c.id !== id);
    
    if (filteredCoupons.length === coupons.length) {
      return false; // Coupon not found
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredCoupons));
    return true;
  }

  // Get coupon statistics
  getCouponStats(): {
    totalCoupons: number;
    activeCoupons: number;
    expiredCoupons: number;
    totalUsage: number;
    totalDiscountGiven: number;
  } {
    const coupons = this.getAllCoupons();
    const usages = this.getCouponUsages();
    const now = new Date().toISOString();

    const activeCoupons = coupons.filter(c => 
      c.isActive && c.validFrom <= now && c.validUntil >= now
    ).length;

    const expiredCoupons = coupons.filter(c => c.validUntil < now).length;

    const totalUsage = usages.length;
    const totalDiscountGiven = usages.reduce((sum, usage) => sum + usage.discountAmount, 0);

    return {
      totalCoupons: coupons.length,
      activeCoupons,
      expiredCoupons,
      totalUsage,
      totalDiscountGiven,
    };
  }
}

export default new CouponService();
