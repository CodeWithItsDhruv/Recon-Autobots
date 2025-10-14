// Razorpay configuration and payment handling
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
  private keyId: string;
  private keySecret: string;

  constructor() {
    this.keyId = 'rzp_test_RTLlA6R5z8SMJB';
    this.keySecret = 'YtiFryyjVreOgce3q68rJKz0';
  }

  // Load Razorpay script
  loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        resolve();
      };
      script.onerror = (error) => {
        console.error('Failed to load Razorpay script:', error);
        reject(new Error('Failed to load Razorpay script'));
      };
      document.head.appendChild(script);
    });
  }

  // Create order (you would typically call your backend API here)
  async createOrder(amount: number, currency: string = 'INR'): Promise<string> {
    // For demo purposes, we'll generate a mock order ID
    // In production, you should call your backend API to create an order
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Mock API call - replace with actual backend call
    console.log('Creating order:', { amount, currency, orderId });
    
    return orderId;
  }

  // Initialize payment
  async initializePayment(options: Partial<RazorpayOptions>): Promise<void> {
    try {
      console.log('Loading Razorpay script...');
      await this.loadScript();
      
      console.log('Razorpay script loaded, initializing payment...');
      console.log('Razorpay available:', !!window.Razorpay);

      if (!window.Razorpay) {
        throw new Error('Razorpay not available after script load');
      }

      const razorpayOptions: RazorpayOptions = {
        key: this.keyId,
        amount: options.amount || 0,
        currency: options.currency || 'INR',
        name: options.name || 'RECON AUTOBOTS',
        description: options.description || 'Motorcycle Riding Gear Purchase',
        prefill: options.prefill || {
          name: '',
          email: '',
          contact: ''
        },
        notes: options.notes || {},
        theme: {
          color: '#F59E0B' // Yellow color matching your brand
        },
        handler: options.handler || (() => {}),
        modal: {
          ondismiss: options.modal?.ondismiss || (() => {})
        },
        ...options
      };

      console.log('Razorpay options:', razorpayOptions);
      
      const razorpay = new window.Razorpay(razorpayOptions);
      console.log('Razorpay instance created, opening modal...');
      
      razorpay.open();
      console.log('Razorpay modal opened');
      
    } catch (error) {
      console.error('Razorpay initialization failed:', error);
      throw error;
    }
  }

  // Verify payment (you would typically call your backend API here)
  async verifyPayment(paymentData: any): Promise<boolean> {
    // For demo purposes, we'll return true
    // In production, you should call your backend API to verify the payment
    console.log('Verifying payment:', paymentData);
    
    // Mock verification - replace with actual backend call
    return true;
  }

  // Get key ID for frontend use
  getKeyId(): string {
    return this.keyId;
  }
}

export const razorpayService = new RazorpayService();
export default razorpayService;
