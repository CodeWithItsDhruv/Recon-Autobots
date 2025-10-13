import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  CreditCard, 
  Shield, 
  ArrowRight, 
  ShoppingBag,
  Info,
  CheckCircle,
  X,
  Package,
  Truck,
  Lock,
  Gift,
  AlertCircle,
  Phone,
  Mail,
  MapPinned,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutForm {
  email: string;
  emailNews: boolean;
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  saveInfo: boolean;
  textNews: boolean;
  shippingMethod: string;
  paymentMethod: string;
  billingAddress: string;
}

interface FormErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  pinCode?: string;
  phone?: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState<CheckoutForm>({
    email: user?.email || '',
    emailNews: true,
    country: 'India',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Gujarat',
    pinCode: '',
    phone: '',
    saveInfo: false,
    textNews: false,
    shippingMethod: 'free',
    paymentMethod: 'razorpay',
    billingAddress: 'same'
  });

  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [deliveryInfo, setDeliveryInfo] = useState<{
    isAvailable: boolean;
    standardDays: number;
    expressDays: number;
    city: string;
    state: string;
  } | null>(null);
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/products');
    }
  }, [cartItems, navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    const pinRegex = /^\d{6}$/;
    if (!formData.pinCode) {
      newErrors.pinCode = 'PIN code is required';
    } else if (!pinRegex.test(formData.pinCode)) {
      newErrors.pinCode = 'Please enter a valid 6-digit PIN code';
    }
    
    const phoneRegex = /^[\d\s\+\-\(\)]{10,15}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkDeliveryAvailability = async (pinCode: string) => {
    if (!pinCode || pinCode.length !== 6) {
      setDeliveryInfo(null);
      return;
    }

    setIsCheckingDelivery(true);
    
    try {
      // Call real PIN code API
      const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
      const result = await response.json();
      
      // API returns an array, get first element
      const data = Array.isArray(result) ? result[0] : result;
      
      // Check for successful response (case-insensitive)
      const isSuccess = data.Status === 'Success' || data.status === 'Success';
      const hasPostOffice = data.PostOffice && Array.isArray(data.PostOffice) && data.PostOffice.length > 0;
      
      if (isSuccess && hasPostOffice) {
        const postOffice = data.PostOffice[0]; // Use first post office data
        
        // Calculate delivery days based on state and city
        const deliveryDays = calculateDeliveryDays(postOffice.State, postOffice.District);
        
        setDeliveryInfo({
          isAvailable: true,
          standardDays: deliveryDays.standard,
          expressDays: deliveryDays.express,
          city: postOffice.District,
          state: postOffice.State
        });

        // Update city and state if they're empty
        if (!formData.city) {
          setFormData(prev => ({ ...prev, city: postOffice.District }));
        }
        if (!formData.state) {
          setFormData(prev => ({ ...prev, state: postOffice.State }));
        }
      } else {
        // Invalid PIN code
        setDeliveryInfo(null);
        toast.error('Invalid PIN code', {
          description: 'Please enter a valid 6-digit PIN code'
        });
      }
    } catch (error) {
      console.error('Error checking PIN code:', error);
      setDeliveryInfo(null);
      toast.error('Unable to verify PIN code', {
        description: 'Please check your internet connection and try again'
      });
    }

    setIsCheckingDelivery(false);
  };

  const calculateDeliveryDays = (state: string, city: string) => {
    // Buffer days for order processing and packaging
    const PROCESSING_BUFFER = 2; // 2 days for order processing and packaging
    const EXPRESS_BUFFER = 1; // 1 day for express order processing
    
    // Special case for Vadodara (shop location)
    if (city.toLowerCase().includes('vadodara') || city.toLowerCase().includes('baroda')) {
      return { 
        standard: 1 + PROCESSING_BUFFER, // 3 days total (1 delivery + 2 processing)
        express: 1 + EXPRESS_BUFFER // 2 days total (1 delivery + 1 processing)
      };
    }
    
    // Major metropolitan cities - faster delivery
    const majorCities = ['mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 'surat'];
    const isMajorCity = majorCities.some(cityName => city.toLowerCase().includes(cityName));
    
    if (isMajorCity) {
      return { 
        standard: 3 + PROCESSING_BUFFER, // 5 days total
        express: 1 + EXPRESS_BUFFER // 2 days total
      };
    }
    
    // State-based delivery calculation
    const stateDeliveryMap: { [key: string]: { standard: number; express: number } } = {
      'Gujarat': { standard: 2, express: 1 },
      'Maharashtra': { standard: 4, express: 2 },
      'Delhi': { standard: 2, express: 1 },
      'Karnataka': { standard: 4, express: 2 },
      'Tamil Nadu': { standard: 4, express: 2 },
      'West Bengal': { standard: 5, express: 2 },
      'Telangana': { standard: 5, express: 2 },
      'Rajasthan': { standard: 5, express: 2 },
      'Uttar Pradesh': { standard: 6, express: 3 },
      'Punjab': { standard: 5, express: 2 },
      'Haryana': { standard: 4, express: 2 },
      'Kerala': { standard: 5, express: 2 },
      'Madhya Pradesh': { standard: 6, express: 3 },
      'Bihar': { standard: 7, express: 3 },
      'Odisha': { standard: 6, express: 3 },
      'Assam': { standard: 8, express: 4 },
      'Jharkhand': { standard: 6, express: 3 },
      'Chhattisgarh': { standard: 6, express: 3 },
      'Himachal Pradesh': { standard: 7, express: 3 },
      'Uttarakhand': { standard: 6, express: 3 },
      'Goa': { standard: 4, express: 2 },
      'Jammu and Kashmir': { standard: 8, express: 4 },
      'Ladakh': { standard: 10, express: 5 },
      'Arunachal Pradesh': { standard: 10, express: 5 },
      'Manipur': { standard: 9, express: 4 },
      'Meghalaya': { standard: 8, express: 4 },
      'Mizoram': { standard: 9, express: 4 },
      'Nagaland': { standard: 9, express: 4 },
      'Sikkim': { standard: 8, express: 4 },
      'Tripura': { standard: 8, express: 4 },
      'Andhra Pradesh': { standard: 5, express: 2 },
      'Chandigarh': { standard: 4, express: 2 },
      'Dadra and Nagar Haveli': { standard: 3, express: 1 },
      'Daman and Diu': { standard: 3, express: 1 },
      'Lakshadweep': { standard: 8, express: 4 },
      'Puducherry': { standard: 4, express: 2 },
      'Andaman and Nicobar Islands': { standard: 10, express: 5 }
    };
    
    const baseDays = stateDeliveryMap[state] || { standard: 7, express: 3 };
    
    // Add buffer days to base delivery time
    return {
      standard: baseDays.standard + PROCESSING_BUFFER,
      express: baseDays.express + EXPRESS_BUFFER
    };
  };

  const handleInputChange = (field: keyof CheckoutForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }

    // Check delivery when PIN code changes
    if (field === 'pinCode' && typeof value === 'string') {
      checkDeliveryAvailability(value);
    }
  };

  const applyDiscount = () => {
    const validCodes = {
      'WELCOME10': { discount: 0.1, description: '10% off on your order' },
      'SAVE20': { discount: 0.2, description: '20% off on your order' },
      'FIRST15': { discount: 0.15, description: '15% off for first-time buyers' },
      'BIKERS25': { discount: 0.25, description: '25% off on motorcycle gear' }
    };
    
    const code = validCodes[discountCode.toUpperCase() as keyof typeof validCodes];
    if (code) {
      setDiscountApplied(true);
      setDiscountAmount(cartTotal * code.discount);
      toast.success('🎉 Discount applied!', {
        description: `${discountCode.toUpperCase()} - ${code.description}`
      });
    } else {
      toast.error('Invalid discount code', {
        description: 'Please check the code and try again'
      });
    }
  };

  const removeDiscount = () => {
    setDiscountApplied(false);
    setDiscountAmount(0);
    setDiscountCode('');
    toast.success('Discount removed');
  };

  const calculateTotal = () => {
    const subtotal = cartTotal;
    const shipping = formData.shippingMethod === 'free' ? 0 : formData.shippingMethod === 'express' ? 200 : 100;
    const total = subtotal + shipping - discountAmount;
    return { subtotal, shipping, total };
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields', {
        description: 'Check the highlighted fields and try again'
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      clearCart();
      
      toast.success('🎉 Order placed successfully!', {
        description: `Order confirmation sent to ${formData.email}`,
        duration: 5000
      });
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      toast.error('Payment failed', {
        description: 'Please try again or contact support'
      });
      setIsProcessing(false);
    }
  };

  const { subtotal, shipping, total } = calculateTotal();

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Secure Checkout - Airoh Vision Crafted</title>
        <meta name="description" content="Complete your order securely with multiple payment options" />
      </Helmet>
      
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-bold">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Cart</span>
              </div>
              
              <div className="flex-1 h-1 bg-black mx-4" />
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Checkout</span>
              </div>
              
              <div className="flex-1 h-1 bg-gray-300 mx-4" />
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-600 text-sm font-bold">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-500">Complete</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Security Badge */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">
              <span className="font-semibold">Secure Checkout</span> - Your information is protected with 256-bit SSL encryption
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Contact Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-2 border-transparent hover:border-gray-200 transition-all shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold">Contact Information</h2>
                          <p className="text-sm text-gray-500">We'll send your order confirmation here</p>
                        </div>
                      </div>
                      {!isAuthenticated && (
                        <button 
                          onClick={() => navigate('/login')}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                        >
                          Sign in
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">Email address *</Label>
                        <div className="relative mt-1.5">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                          />
                        </div>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.email}</span>
                          </motion.p>
                        )}
                      </div>
                      
                      <div className="flex items-start space-x-2 pt-2">
                        <Checkbox
                          id="emailNews"
                          checked={formData.emailNews}
                          onCheckedChange={(checked) => handleInputChange('emailNews', checked as boolean)}
                          className="mt-0.5"
                        />
                        <Label htmlFor="emailNews" className="text-sm text-gray-600 cursor-pointer">
                          Keep me updated with exclusive offers and motorcycle gear news
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Delivery Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="border-2 border-transparent hover:border-gray-200 transition-all shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">Delivery Address</h2>
                        <p className="text-sm text-gray-500">Where should we deliver your order?</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="country" className="text-sm font-medium">Country/Region *</Label>
                        <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="India">🇮🇳 India</SelectItem>
                            <SelectItem value="USA">🇺🇸 United States</SelectItem>
                            <SelectItem value="UK">🇬🇧 United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-sm font-medium">First name *</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className={`mt-1.5 ${errors.firstName ? 'border-red-500' : ''}`}
                          />
                          {errors.firstName && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                            >
                              <AlertCircle className="w-3 h-3" />
                              <span>{errors.firstName}</span>
                            </motion.p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-sm font-medium">Last name *</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className={`mt-1.5 ${errors.lastName ? 'border-red-500' : ''}`}
                          />
                          {errors.lastName && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                            >
                              <AlertCircle className="w-3 h-3" />
                              <span>{errors.lastName}</span>
                            </motion.p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="address" className="text-sm font-medium">Street Address *</Label>
                        <div className="relative mt-1.5">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="address"
                            placeholder="123 Main Street"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className={`pl-10 ${errors.address ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {errors.address && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.address}</span>
                          </motion.p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="apartment" className="text-sm font-medium">Apartment, suite, etc. (optional)</Label>
                        <Input
                          id="apartment"
                          placeholder="Apt 4B"
                          value={formData.apartment}
                          onChange={(e) => handleInputChange('apartment', e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city" className="text-sm font-medium">City *</Label>
                          <Input
                            id="city"
                            placeholder="Mumbai"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className={`mt-1.5 ${errors.city ? 'border-red-500' : ''}`}
                          />
                          {errors.city && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-1 text-xs text-red-600 flex items-center space-x-1"
                            >
                              <AlertCircle className="w-3 h-3" />
                              <span>{errors.city}</span>
                            </motion.p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="state" className="text-sm font-medium">State *</Label>
                          <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                            <SelectTrigger className="mt-1.5">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Gujarat">Gujarat</SelectItem>
                              <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                              <SelectItem value="Delhi">Delhi</SelectItem>
                              <SelectItem value="Karnataka">Karnataka</SelectItem>
                              <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="pinCode" className="text-sm font-medium">PIN code *</Label>
                          <div className="relative mt-1.5">
                            <Input
                              id="pinCode"
                              placeholder="400001"
                              value={formData.pinCode}
                              onChange={(e) => handleInputChange('pinCode', e.target.value)}
                              className={`${errors.pinCode ? 'border-red-500' : ''}`}
                            />
                            {isCheckingDelivery && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                              </div>
                            )}
                          </div>
                          {errors.pinCode && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-1 text-xs text-red-600 flex items-center space-x-1"
                            >
                              <AlertCircle className="w-3 h-3" />
                              <span>{errors.pinCode}</span>
                            </motion.p>
                          )}
                          
                          {/* Delivery Information */}
                          {deliveryInfo && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 bg-gray-50 border border-gray-200 rounded-md p-2"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5">
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                  <span className="text-gray-700 font-medium">
                                    {deliveryInfo.city}, {deliveryInfo.state}
                                  </span>
                                  {deliveryInfo.city === 'Vadodara' && (
                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs px-1 py-0">
                                      Shop
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                  <span className="text-gray-600">
                                    <span className="font-medium text-gray-900">{deliveryInfo.standardDays}d</span> standard
                                  </span>
                                  <span className="text-gray-600">
                                    <span className="font-medium text-gray-900">{deliveryInfo.expressDays}d</span> express
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                        <div className="relative mt-1.5">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="phone"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">🇮🇳</span>
                        </div>
                        {errors.phone && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-1 text-sm text-red-600 flex items-center space-x-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.phone}</span>
                          </motion.p>
                        )}
                      </div>
                      
                      <div className="pt-2">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="saveInfo"
                            checked={formData.saveInfo}
                            onCheckedChange={(checked) => handleInputChange('saveInfo', checked as boolean)}
                            className="mt-0.5"
                          />
                          <Label htmlFor="saveInfo" className="text-sm text-gray-600 cursor-pointer">
                            Save this information for faster checkout next time
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Shipping Method Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="border-2 border-transparent hover:border-gray-200 transition-all shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">Shipping Method</h2>
                        <p className="text-sm text-gray-500">Choose how you want to receive your order</p>
                      </div>
                    </div>
                    
                    <RadioGroup value={formData.shippingMethod} onValueChange={(value) => handleInputChange('shippingMethod', value)}>
                      <div className="space-y-3">
                        <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.shippingMethod === 'free' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <RadioGroupItem value="free" id="free" />
                          <Label htmlFor="free" className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold">FREE Standard Shipping</div>
                                <div className="text-sm text-gray-500">
                                  {deliveryInfo ? `Delivery in ${deliveryInfo.standardDays} business days` : 'Delivery in 5-7 business days'}
                                </div>
                              </div>
                              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">FREE</Badge>
                            </div>
                          </Label>
                        </div>
                        
                        <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.shippingMethod === 'express' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express" className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold flex items-center space-x-2">
                                  <span>Express Shipping</span>
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">Fast</Badge>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {deliveryInfo ? `Delivery in ${deliveryInfo.expressDays} business days` : 'Delivery in 2-3 business days'}
                                </div>
                              </div>
                              <span className="font-semibold">₹200</span>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Payment Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="border-2 border-transparent hover:border-gray-200 transition-all shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">Payment Method</h2>
                        <p className="text-sm text-gray-500">All transactions are secure and encrypted</p>
                      </div>
                    </div>
                    
                    <RadioGroup value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                      <div className="space-y-3">
                        <div className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'razorpay' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <RadioGroupItem value="razorpay" id="razorpay" className="mt-1" />
                          <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                            <div>
                              <div className="font-semibold flex items-center space-x-2">
                                <span>Razorpay Secure</span>
                                <Badge variant="outline" className="text-xs">Recommended</Badge>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">UPI, Cards, Int'l Cards, Wallets & More</div>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xl">💳</span>
                                <span className="text-xl">📱</span>
                                <span className="text-xl">🏦</span>
                                <span className="text-xs text-gray-500">+18 more</span>
                              </div>
                            </div>
                          </Label>
                        </div>
                        
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-3"
                        >
                          <div className="flex items-start space-x-2">
                            <Lock className="w-4 h-4 text-blue-600 mt-0.5" />
                            <p className="text-sm text-blue-800">
                              You'll be redirected to Razorpay's secure payment gateway to complete your purchase safely.
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Billing Address Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Card className="border-2 border-transparent hover:border-gray-200 transition-all shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white">
                        <MapPinned className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">Billing Address</h2>
                        <p className="text-sm text-gray-500">Select your billing address</p>
                      </div>
                    </div>
                    
                    <RadioGroup value={formData.billingAddress} onValueChange={(value) => handleInputChange('billingAddress', value)}>
                      <div className="space-y-3">
                        <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.billingAddress === 'same' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <RadioGroupItem value="same" id="same" />
                          <Label htmlFor="same" className="cursor-pointer font-medium">
                            Same as shipping address
                          </Label>
                        </div>
                        
                        <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.billingAddress === 'different' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <RadioGroupItem value="different" id="different" />
                          <Label htmlFor="different" className="cursor-pointer font-medium">
                            Use a different billing address
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pay Now Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="flex justify-center pt-4"
              >
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full max-w-md bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-6 px-8 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      Complete Order • ₹{total.toLocaleString()}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Footer Links */}
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 pt-4">
                <a href="/privacy-policy" className="hover:text-gray-700 transition-colors">Refund policy</a>
                <span>•</span>
                <a href="/privacy-policy" className="hover:text-gray-700 transition-colors">Shipping</a>
                <span>•</span>
                <a href="/privacy-policy" className="hover:text-gray-700 transition-colors">Privacy policy</a>
                <span>•</span>
                <a href="/terms-of-service" className="hover:text-gray-700 transition-colors">Terms of service</a>
                <span>•</span>
                <a href="/contact" className="hover:text-gray-700 transition-colors">Contact</a>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="sticky top-24 shadow-2xl border-2">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Order Summary</h3>
                      <Badge variant="secondary" className="bg-black text-white">
                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)} Items
                      </Badge>
                    </div>
                    
                    {/* Cart Items */}
                    <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <Badge className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center p-0 bg-black text-white">
                              {item.quantity}
                            </Badge>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                            {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                            <p className="text-sm font-bold mt-1">₹{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Discount Code */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <Label className="text-sm font-semibold mb-2 flex items-center space-x-1">
                        <Gift className="w-4 h-4" />
                        <span>Have a discount code?</span>
                      </Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          placeholder="Enter code"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          disabled={discountApplied}
                          className="flex-1 bg-white"
                        />
                        {discountApplied ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={removeDiscount}
                            className="px-3"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={applyDiscount}
                            disabled={!discountCode}
                            className="bg-black text-white hover:bg-gray-800"
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                      {discountApplied && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 flex items-center text-green-600 text-sm font-medium bg-white p-2 rounded"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Saved ₹{discountAmount.toLocaleString()}!
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-semibold">{shipping === 0 ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">FREE</Badge>
                        ) : `₹${shipping}`}</span>
                      </div>
                      {discountApplied && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span className="font-medium">Discount</span>
                          <span className="font-semibold">-₹{discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-600">Total Amount</div>
                        <div className="text-xs text-gray-500">INR (incl. taxes)</div>
                      </div>
                      <div className="text-2xl font-bold">₹{total.toLocaleString()}</div>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-6 pt-6 border-t space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span>Secure checkout with SSL encryption</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span>Free shipping on all orders</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Package className="w-4 h-4 text-purple-600" />
                        <span>Easy returns within 30 days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Checkout;
