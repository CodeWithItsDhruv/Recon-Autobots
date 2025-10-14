// Order Management System with Firebase Integration
import { firebaseOrderService, Order, OrderItem } from './firebase-orders';

// Re-export types for backward compatibility
export type { Order, OrderItem };

class OrderService {
  // Save order to Firebase
  async saveOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return await firebaseOrderService.saveOrder(order);
  }

  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    try {
      const orders = await firebaseOrderService.getAllOrders();
      
      // If no orders in Firebase, return dummy data for testing
      if (orders.length === 0) {
        return this.getDummyOrders();
      }
      
      return orders;
    } catch (error) {
      console.error('Failed to get orders from Firebase, returning dummy data:', error);
      return this.getDummyOrders();
    }
  }

  // Get orders by user ID
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return await firebaseOrderService.getOrdersByUserId(userId);
  }

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    return await firebaseOrderService.getOrderById(orderId);
  }

  // Get order by order number
  async getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
    return await firebaseOrderService.getOrderByOrderNumber(orderNumber);
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    return await firebaseOrderService.updateOrderStatus(orderId, status);
  }

  // Update order tracking information
  async updateOrderTracking(orderId: string, trackingNumber: string, estimatedDelivery: string): Promise<boolean> {
    return await firebaseOrderService.updateOrderTracking(orderId, trackingNumber, estimatedDelivery);
  }

  // Get orders by status
  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    return await firebaseOrderService.getOrdersByStatus(status);
  }

  // Get recent orders
  async getRecentOrders(limitCount: number = 10): Promise<Order[]> {
    return await firebaseOrderService.getRecentOrders(limitCount);
  }

  // Listen to orders changes (real-time updates)
  onOrdersChange(callback: (orders: Order[]) => void): () => void {
    return firebaseOrderService.onOrdersChange(callback);
  }

  // Listen to user orders changes
  onUserOrdersChange(userId: string, callback: (orders: Order[]) => void): () => void {
    return firebaseOrderService.onUserOrdersChange(userId, callback);
  }

  // Delete order (admin function)
  async deleteOrder(orderId: string): Promise<boolean> {
    return await firebaseOrderService.deleteOrder(orderId);
  }

  // Generate order number
  generateOrderNumber(): string {
    return firebaseOrderService.generateOrderNumber();
  }

  // Generate tracking number
  generateTrackingNumber(): string {
    return firebaseOrderService.generateTrackingNumber();
  }

  // Get dummy orders for testing
  private getDummyOrders(): Order[] {
    return [
      {
        id: '1',
        orderNumber: 'ORD-20241215-001',
        date: '2024-12-15',
        status: 'delivered',
        userId: 'user1',
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+91 9876543210',
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        items: [
          {
            id: '1',
            name: 'Premium Motorcycle Helmet',
            price: 2500,
            quantity: 1,
            size: 'L',
            image: '/src/assets/hero-helmet-1.jpg'
          }
        ],
        subtotal: 2500,
        tax: 450,
        shipping: 100,
        total: 3050,
        paymentMethod: 'Razorpay',
        paymentId: 'pay_123456789',
        trackingNumber: 'BD1234567890',
        estimatedDelivery: '2024-12-22',
        createdAt: new Date('2024-12-15').toISOString() as any,
        updatedAt: new Date('2024-12-15').toISOString() as any
      },
      {
        id: '2',
        orderNumber: 'ORD-20241214-002',
        date: '2024-12-14',
        status: 'shipped',
        userId: 'user1',
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+91 9876543210',
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        items: [
          {
            id: '2',
            name: 'Racing Gloves',
            price: 800,
            quantity: 2,
            size: 'M',
            image: '/src/assets/gloves-1.jpg'
          }
        ],
        subtotal: 1600,
        tax: 288,
        shipping: 100,
        total: 1988,
        paymentMethod: 'Razorpay',
        paymentId: 'pay_987654321',
        trackingNumber: 'BD0987654321',
        estimatedDelivery: '2024-12-21',
        createdAt: new Date('2024-12-14').toISOString() as any,
        updatedAt: new Date('2024-12-14').toISOString() as any
      },
      {
        id: '3',
        orderNumber: 'ORD-20241213-003',
        date: '2024-12-13',
        status: 'confirmed',
        userId: 'user1',
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+91 9876543210',
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        items: [
          {
            id: '3',
            name: 'Racing Jacket',
            price: 1800,
            quantity: 1,
            size: 'L',
            image: '/src/assets/jacket-1.jpg'
          }
        ],
        subtotal: 1800,
        tax: 324,
        shipping: 100,
        total: 2224,
        paymentMethod: 'Razorpay',
        paymentId: 'pay_456789123',
        trackingNumber: 'BD4567891234',
        estimatedDelivery: '2024-12-20',
        createdAt: new Date('2024-12-13').toISOString() as any,
        updatedAt: new Date('2024-12-13').toISOString() as any
      },
      {
        id: '4',
        orderNumber: 'ORD-20241212-004',
        date: '2024-12-12',
        status: 'pending',
        userId: 'user1',
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+91 9876543210',
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        items: [
          {
            id: '4',
            name: 'Motorcycle Boots',
            price: 1200,
            quantity: 1,
            size: '42',
            image: '/src/assets/boots-1.jpg'
          }
        ],
        subtotal: 1200,
        tax: 216,
        shipping: 100,
        total: 1516,
        paymentMethod: 'Razorpay',
        paymentId: 'pay_789123456',
        createdAt: new Date('2024-12-12').toISOString() as any,
        updatedAt: new Date('2024-12-12').toISOString() as any
      },
      {
        id: '5',
        orderNumber: 'ORD-20241211-005',
        date: '2024-12-11',
        status: 'cancelled',
        userId: 'user1',
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+91 9876543210',
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        items: [
          {
            id: '5',
            name: 'Motorcycle Helmet',
            price: 3200,
            quantity: 1,
            size: 'XL',
            image: '/src/assets/hero-helmet-1.jpg'
          }
        ],
        subtotal: 3200,
        tax: 576,
        shipping: 100,
        total: 3876,
        paymentMethod: 'Razorpay',
        paymentId: 'pay_321654987',
        createdAt: new Date('2024-12-11').toISOString() as any,
        updatedAt: new Date('2024-12-11').toISOString() as any
      }
    ];
  }

  // Get estimated delivery date
  getEstimatedDelivery(): string {
    return firebaseOrderService.getEstimatedDelivery();
  }

  // Create order from payment data
  async createOrderFromPayment(
    paymentData: any,
    customerData: any,
    cartItems: OrderItem[],
    totals: { subtotal: number; tax: number; shipping: number; total: number },
    userId: string
  ): Promise<string> {
    return await firebaseOrderService.createOrderFromPayment(
      paymentData,
      customerData,
      cartItems,
      totals,
      userId
    );
  }

  // Legacy methods for backward compatibility (now using Firebase)
  saveOrderLegacy(order: Order): void {
    console.warn('saveOrderLegacy is deprecated. Use saveOrder instead.');
    // This method is kept for backward compatibility but doesn't actually save
  }

  getAllOrdersLegacy(): Order[] {
    console.warn('getAllOrdersLegacy is deprecated. Use getAllOrders instead.');
    return [];
  }

  getOrderByIdLegacy(orderId: string): Order | null {
    console.warn('getOrderByIdLegacy is deprecated. Use getOrderById instead.');
    return null;
  }

  getOrdersByEmailLegacy(email: string): Order[] {
    console.warn('getOrdersByEmailLegacy is deprecated. Use getOrdersByUserId instead.');
    return [];
  }

  updateOrderStatusLegacy(orderId: string, status: Order['status']): boolean {
    console.warn('updateOrderStatusLegacy is deprecated. Use updateOrderStatus instead.');
    return false;
  }

  getDummyOrders(): Order[] {
    // Return empty array as we're now using Firebase
    return [];
  }
}

export const orderService = new OrderService();
export default orderService;
