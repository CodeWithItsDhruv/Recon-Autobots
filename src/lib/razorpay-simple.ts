// Simplified Razorpay integration
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    [key: string]: string;
  };
  theme: {
    color: string;
  };
  handler: (response: any) => void;
  modal: {
    ondismiss: () => void;
  };
}

class RazorpayService {
  private keyId: string = 'rzp_test_RTLlA6R5z8SMJB';

  // Simple script loading - script is already loaded in HTML
  async loadScript(): Promise<void> {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve();
        return;
      }
      
      // Wait for script to load from HTML
      const checkRazorpay = () => {
        if (window.Razorpay) {
          resolve();
        } else {
          setTimeout(checkRazorpay, 100);
        }
      };
      checkRazorpay();
    });
  }

  // Create mock order
  async createOrder(amount: number): Promise<string> {
    return `order_${Date.now()}`;
  }

  // Initialize payment with better error handling
  async initializePayment(options: Partial<RazorpayOptions>): Promise<void> {
    try {
      // Load script
      await this.loadScript();
      
      // Wait a bit for script to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!window.Razorpay) {
        throw new Error('Razorpay not loaded');
      }

      const razorpayOptions = {
        key: this.keyId,
        amount: options.amount || 0,
        currency: 'INR',
        name: 'RECON AUTOBOTS',
        description: options.description || 'Order Payment',
        prefill: options.prefill || {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#F59E0B'
        },
        handler: options.handler || (() => {}),
        modal: {
          ondismiss: options.modal?.ondismiss || (() => {})
        }
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }

  // Mock verification
  async verifyPayment(paymentData: any): Promise<boolean> {
    console.log('Payment data:', paymentData);
    return true;
  }
}

export const razorpayService = new RazorpayService();
export default razorpayService;
