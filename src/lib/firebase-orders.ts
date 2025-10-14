import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image?: string;
}

export interface Order {
  id?: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  userId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  paymentId?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

class FirebaseOrderService {
  private ordersCollection = collection(db, 'orders');

  // Save order to Firestore
  async saveOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const orderData = {
        ...order,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(this.ordersCollection, orderData);
      console.log('Order saved with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Failed to save order:', error);
      throw new Error('Failed to save order');
    }
  }

  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    try {
      const q = query(this.ordersCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error) {
      console.error('Failed to get orders:', error);
      return [];
    }
  }

  // Get orders by user ID
  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      const q = query(
        this.ordersCollection, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error) {
      console.error('Failed to get user orders:', error);
      return [];
    }
  }

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(this.ordersCollection, orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Order;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Failed to get order:', error);
      return null;
    }
  }

  // Get order by order number
  async getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
    try {
      const q = query(this.ordersCollection, where('orderNumber', '==', orderNumber));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data()
        } as Order;
      }
      return null;
    } catch (error) {
      console.error('Failed to get order by number:', error);
      return null;
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    try {
      const docRef = doc(this.ordersCollection, orderId);
      await updateDoc(docRef, {
        status: status,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Failed to update order status:', error);
      return false;
    }
  }

  // Update order tracking information
  async updateOrderTracking(orderId: string, trackingNumber: string, estimatedDelivery: string): Promise<boolean> {
    try {
      const docRef = doc(this.ordersCollection, orderId);
      await updateDoc(docRef, {
        trackingNumber: trackingNumber,
        estimatedDelivery: estimatedDelivery,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (error) {
      console.error('Failed to update order tracking:', error);
      return false;
    }
  }

  // Get orders by status
  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    try {
      const q = query(
        this.ordersCollection, 
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error) {
      console.error('Failed to get orders by status:', error);
      return [];
    }
  }

  // Get recent orders (last 10)
  async getRecentOrders(limitCount: number = 10): Promise<Order[]> {
    try {
      const q = query(
        this.ordersCollection, 
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error) {
      console.error('Failed to get recent orders:', error);
      return [];
    }
  }

  // Listen to orders changes (real-time updates)
  onOrdersChange(callback: (orders: Order[]) => void): () => void {
    const q = query(this.ordersCollection, orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
      callback(orders);
    });
  }

  // Listen to user orders changes
  onUserOrdersChange(userId: string, callback: (orders: Order[]) => void): () => void {
    const q = query(
      this.ordersCollection, 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
      callback(orders);
    });
  }

  // Delete order (admin function)
  async deleteOrder(orderId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(this.ordersCollection, orderId));
      return true;
    } catch (error) {
      console.error('Failed to delete order:', error);
      return false;
    }
  }

  // Generate order number
  generateOrderNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${year}${month}${day}-${random}`;
  }

  // Generate tracking number
  generateTrackingNumber(): string {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TRK-${random}`;
  }

  // Get estimated delivery date
  getEstimatedDelivery(): string {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 days from now
    return deliveryDate.toLocaleDateString('en-IN');
  }

  // Create order from payment data
  async createOrderFromPayment(
    paymentData: any,
    customerData: any,
    cartItems: OrderItem[],
    totals: { subtotal: number; tax: number; shipping: number; total: number },
    userId: string
  ): Promise<string> {
    const orderData = {
      orderNumber: this.generateOrderNumber(),
      date: new Date().toLocaleDateString('en-IN'),
      status: 'confirmed' as const,
      userId: userId,
      customer: {
        name: `${customerData.firstName} ${customerData.lastName}`,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        state: customerData.state,
        pincode: customerData.pinCode
      },
      items: cartItems,
      subtotal: totals.subtotal,
      tax: totals.tax,
      shipping: totals.shipping,
      total: totals.total,
      paymentMethod: 'Razorpay',
      paymentId: paymentData.razorpay_payment_id,
      trackingNumber: this.generateTrackingNumber(),
      estimatedDelivery: this.getEstimatedDelivery()
    };

    return await this.saveOrder(orderData);
  }
}

export const firebaseOrderService = new FirebaseOrderService();
export default firebaseOrderService;
