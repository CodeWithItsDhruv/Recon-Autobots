import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import { 
  Search, 
  MapPin, 
  CreditCard, 
  Shield, 
  ArrowRight, 
  ShoppingBag,
  Info,
  CheckCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutForm {
  // Contact
  email: string;
  emailNews: boolean;
  
  // Delivery
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
  
  // Shipping
  shippingMethod: string;
  
  // Payment
  paymentMethod: string;
  
  // Billing
  billingAddress: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState<CheckoutForm>({
    email: user?.email || 'dhruvrathod3761@gmail.com',
    emailNews: true,
    country: 'India',
    firstName: 'DHRUVKUMAR',
    lastName: 'RATHOD',
    address: 'KAMREJ, SURAT',
    apartment: '',
    city: 'SURAT',
    state: 'Gujarat',
    pinCode: '394339',
    phone: '+91 81608 50671',
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

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/products');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (field: keyof CheckoutForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyDiscount = () => {
    const validCodes = {
      'WELCOME10': 0.1,
      'SAVE20': 0.2,
      'FIRST15': 0.15
    };
    
    const discount = validCodes[discountCode.toUpperCase() as keyof typeof validCodes];
    if (discount) {
      setDiscountApplied(true);
      setDiscountAmount(cartTotal * discount);
      toast.success('Discount applied!', {
        description: `${discountCode.toUpperCase()} - ${Math.round(discount * 100)}% off`
      });
    } else {
      toast.error('Invalid discount code');
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
    const shipping = formData.shippingMethod === 'free' ? 0 : 100;
    const total = subtotal + shipping - discountAmount;
    return { subtotal, shipping, total };
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear cart and show success
    clearCart();
    toast.success('Order placed successfully!', {
      description: 'You will receive a confirmation email shortly.'
    });
    
    // Redirect to order confirmation or home
    navigate('/');
  };

  const { subtotal, shipping, total } = calculateTotal();

  if (cartItems.length === 0) {
    return null; // Will redirect
  }

  return (
    <>
      <Helmet>
        <title>Checkout - Airoh Vision Crafted</title>
        <meta name="description" content="Complete your order securely" />
      </Helmet>
      
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Contact Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Contact</h2>
                    {!isAuthenticated && (
                      <button className="text-sm text-blue-600 underline hover:text-blue-800">
                        Sign in
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email or mobile phone number</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="emailNews"
                        checked={formData.emailNews}
                        onCheckedChange={(checked) => handleInputChange('emailNews', checked as boolean)}
                      />
                      <Label htmlFor="emailNews" className="text-sm">
                        Email me with news and offers
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Section */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Delivery</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="country">Country/Region</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="USA">United States</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First name (optional)</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <div className="relative mt-1">
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                      <Input
                        id="apartment"
                        value={formData.apartment}
                        onChange={(e) => handleInputChange('apartment', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Gujarat">Gujarat</SelectItem>
                            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="Delhi">Delhi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="pinCode">PIN code</Label>
                        <Input
                          id="pinCode"
                          value={formData.pinCode}
                          onChange={(e) => handleInputChange('pinCode', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative mt-1">
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                          <Info className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">🇮🇳</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="saveInfo"
                          checked={formData.saveInfo}
                          onCheckedChange={(checked) => handleInputChange('saveInfo', checked as boolean)}
                        />
                        <Label htmlFor="saveInfo" className="text-sm">
                          Save this information for next time
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="textNews"
                          checked={formData.textNews}
                          onCheckedChange={(checked) => handleInputChange('textNews', checked as boolean)}
                        />
                        <Label htmlFor="textNews" className="text-sm">
                          Text me with news and offers
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method Section */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Shipping method</h2>
                  
                  <RadioGroup value={formData.shippingMethod} onValueChange={(value) => handleInputChange('shippingMethod', value)}>
                    <div className="flex items-center space-x-2 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                      <RadioGroupItem value="free" id="free" />
                      <Label htmlFor="free" className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">FREE SHIPPING</span>
                          <span className="font-semibold">FREE</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Section */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Payment</h2>
                  <p className="text-sm text-gray-600 mb-4">All transactions are secure and encrypted.</p>
                  
                  <RadioGroup value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                        <RadioGroupItem value="razorpay" id="razorpay" />
                        <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">Razorpay Secure (UPI, Cards, Int'l Cards, Wallets)</div>
                              <div className="flex items-center space-x-1 mt-1">
                                <span className="text-xs">💳</span>
                                <span className="text-xs">🏦</span>
                                <span className="text-xs">+18</span>
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <CreditCard className="w-4 h-4" />
                          <span>After clicking 'Pay now', you will be redirected to Razorpay Secure (UPI, Cards, Int'l Cards, Wallets) to complete your purchase securely.</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg">
                        <RadioGroupItem value="phonepe" id="phonepe" />
                        <Label htmlFor="phonepe" className="flex-1 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">PhonePe Payment Gateway (UPI, Cards & NetBanking)</div>
                              <div className="flex items-center space-x-1 mt-1">
                                <span className="text-xs">💳</span>
                                <span className="text-xs">🏦</span>
                                <span className="text-xs">+4</span>
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Billing Address Section */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Billing address</h2>
                  
                  <RadioGroup value={formData.billingAddress} onValueChange={(value) => handleInputChange('billingAddress', value)}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                        <RadioGroupItem value="same" id="same" />
                        <Label htmlFor="same" className="cursor-pointer">
                          Same as shipping address
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg">
                        <RadioGroupItem value="different" id="different" />
                        <Label htmlFor="different" className="cursor-pointer">
                          Use a different billing address
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Pay Now Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full max-w-md bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-8 rounded-lg text-lg"
                >
                  {isProcessing ? 'Processing...' : 'Pay now'}
                </Button>
              </div>

              {/* Footer Links */}
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                <a href="#" className="hover:text-gray-700">Refund policy</a>
                <a href="#" className="hover:text-gray-700">Shipping</a>
                <a href="#" className="hover:text-gray-700">Privacy policy</a>
                <a href="#" className="hover:text-gray-700">Terms of service</a>
                <a href="#" className="hover:text-gray-700">Contact</a>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Order Summary</h3>
                    <ShoppingBag className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          {item.size && <p className="text-xs text-gray-500">{item.size}</p>}
                          <p className="text-sm font-semibold">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Discount Code */}
                  <div className="mb-6">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Discount code"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        disabled={discountApplied}
                        className="flex-1"
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
                          variant="outline"
                          size="sm"
                          onClick={applyDiscount}
                          disabled={!discountCode}
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                    {discountApplied && (
                      <div className="mt-2 flex items-center text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Discount applied: ₹{discountAmount.toLocaleString()}
                      </div>
                    )}
                  </div>
                  
                  {/* Price Breakdown */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                    </div>
                    {discountApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">Total</div>
                      <div className="text-sm text-gray-500">INR</div>
                    </div>
                    <div className="text-xl font-bold">₹{total.toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Checkout;
