import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Menu, X, ChevronDown, Search, ShoppingCart, User, LogOut, Settings, Shield, Package, Trash2, Plus, Minus, MapPin, CheckCircle, AlertCircle, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import productsData from '@/data/products.json';
import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // PIN code checker state
  const [pinCode, setPinCode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState<{
    isAvailable: boolean;
    standardDays: number;
    expressDays: number;
    city: string;
    state: string;
  } | null>(null);
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest('.profile-dropdown')) {
          setProfileDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownOpen]);

  // PIN code checker functions
  const calculateDeliveryDays = (state: string, city: string) => {
    const PROCESSING_BUFFER = 2;
    const EXPRESS_BUFFER = 1;
    
    if (city.toLowerCase().includes('vadodara') || city.toLowerCase().includes('baroda')) {
      return { 
        standard: 1 + PROCESSING_BUFFER,
        express: 1 + EXPRESS_BUFFER
      };
    }
    
    const majorCities = ['mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 'surat'];
    const isMajorCity = majorCities.some(cityName => city.toLowerCase().includes(cityName));
    
    if (isMajorCity) {
      return { 
        standard: 3 + PROCESSING_BUFFER,
        express: 1 + EXPRESS_BUFFER
      };
    }
    
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
    
    return {
      standard: baseDays.standard + PROCESSING_BUFFER,
      express: baseDays.express + EXPRESS_BUFFER
    };
  };

  const checkDeliveryAvailability = async (pinCodeValue: string) => {
    if (!pinCodeValue || pinCodeValue.length !== 6) {
      setDeliveryInfo(null);
      return;
    }

    setIsCheckingDelivery(true);
    
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pinCodeValue}`);
      const result = await response.json();
      
      const data = Array.isArray(result) ? result[0] : result;
      
      const isSuccess = data.Status === 'Success' || data.status === 'Success';
      const hasPostOffice = data.PostOffice && Array.isArray(data.PostOffice) && data.PostOffice.length > 0;
      
      if (isSuccess && hasPostOffice) {
        const postOffice = data.PostOffice[0];
        const deliveryDays = calculateDeliveryDays(postOffice.State, postOffice.District);
        
        setDeliveryInfo({
          isAvailable: true,
          standardDays: deliveryDays.standard,
          expressDays: deliveryDays.express,
          city: postOffice.District,
          state: postOffice.State
        });
      } else {
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

  const handlePinCodeChange = (value: string) => {
    setPinCode(value);
    checkDeliveryAvailability(value);
  };

  const mainCategories = [
    { name: 'Helmets', path: '/products?category=helmets' },
    { name: 'Jackets', path: '/products?category=jackets' },
    { name: 'Gloves', path: '/products?category=gloves' },
    { name: 'Boots', path: '/products?category=boots' },
  ];
  
  const shopItems = [
    { name: 'All Products', path: '/products' },
    { name: 'Jackets', path: '/products?category=jackets' },
    { name: 'Pants', path: '/products?category=pants' },
    { name: 'Gloves', path: '/products?category=gloves' },
    { name: 'Boots', path: '/products?category=boots' },
    { name: 'Helmets', path: '/products?category=helmets' },
    { name: 'Protective Gear', path: '/products?category=protection' },
    { name: 'Luggage', path: '/products?category=luggage' },
    { name: 'Fog Lights', path: '/products?category=fog-lights' },
    { name: 'Accessories', path: '/products?category=accessories' },
  ];
  
  // Product images mapping
  const productImages: { [key: string]: string } = {
    'apex-riding-jacket': product1,
    'trail-blazer-helmet': product2,
    'carbon-pro-gloves': product3,
    'explorer-touring-boots': product1,
    'velocity-mesh-jacket': product2,
    'thunder-riding-pants': product3,
    'alpha-saddlebags': product1,
    'nova-fog-lights': product2,
    'titan-tank-bag': product3,
    'grip-max-gloves': product1,
    'urban-jet-helmet': product2,
    'armor-vest': product3,
  };
  
  // Search functionality
  const searchResults = searchQuery.trim().length > 0
    ? productsData.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];
  
  const handleSearchItemClick = (productId: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };
  
  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchOpen) {
        const target = event.target as Element;
        if (!target.closest('.search-container')) {
          setSearchOpen(false);
          setSearchQuery('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);
  
  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md border-b border-gray-200' : 'bg-white/95 backdrop-blur-md border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-black text-black tracking-wider group-hover:text-accent transition-colors duration-300">
                RECON AUTOBOTS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Main Categories */}
              {mainCategories.map((category) => (
                <NavLink
                  key={category.path}
                  to={category.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-all duration-200 py-2 px-4 rounded-lg ${
                      isActive 
                        ? 'text-black bg-gray-100' 
                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                    }`
                  }
                >
                  {category.name}
                </NavLink>
              ))}
              
              {/* More Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setActiveDropdown('more')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center space-x-1 text-gray-600 hover:text-black transition-all duration-200 font-semibold text-sm py-2 px-4 rounded-lg hover:bg-gray-50">
                  <span>More</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'more' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="py-2">
                        <Link
                          to="/products"
                          className="block px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700 hover:text-black border-b border-gray-100"
                        >
                          All Products
                        </Link>
                        <Link
                          to="/products?category=pants"
                          className="block px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 hover:text-black"
                        >
                          Riding Pants
                        </Link>
                        <Link
                          to="/products?category=protection"
                          className="block px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 hover:text-black"
                        >
                          Protective Gear
                        </Link>
                        <Link
                          to="/products?category=luggage"
                          className="block px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 hover:text-black"
                        >
                          Luggage
                        </Link>
                        <Link
                          to="/products?category=fog-lights"
                          className="block px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 hover:text-black"
                        >
                          Fog Lights
                        </Link>
                        <Link
                          to="/products?category=accessories"
                          className="block px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 hover:text-black"
                        >
                          Accessories
                        </Link>
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <Link
                            to="/about"
                            className="block px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 hover:text-black"
                          >
                            About Us
                          </Link>
                          <Link
                            to="/contact"
                            className="block px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 hover:text-black"
                          >
                            Contact
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Icons */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Search Bar */}
              <div className="relative search-container">
                {!searchOpen ? (
                  <button 
                    onClick={() => setSearchOpen(true)}
                    className="p-2.5 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="relative">
                    <motion.div
                      initial={{ width: 40 }}
                      animate={{ width: 320 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:border-gray-300 focus:outline-none text-sm"
                      />
                      <button
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </motion.div>
                    
                    {/* Search Results Dropdown */}
                    <AnimatePresence>
                      {searchQuery.trim().length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50"
                        >
                          {searchResults.length > 0 ? (
                            <div className="py-2">
                              {searchResults.map((product) => (
                                <button
                                  key={product.id}
                                  onClick={() => handleSearchItemClick(product.id)}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                                >
                                  <img
                                    src={productImages[product.id] || product1}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded border border-gray-200"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-gray-900 truncate">
                                      {product.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{product.category}</p>
                                  </div>
                                  <p className="text-sm font-bold text-gray-900">{product.price}</p>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="px-4 py-6 text-center">
                              <p className="text-sm text-gray-500">No products found</p>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
              
              {/* Profile Button */}
              <div className="relative profile-dropdown">
                <button 
                  onClick={() => {
                    if (isAuthenticated) {
                      setProfileDropdownOpen(!profileDropdownOpen);
                    } else {
                      navigate('/admin/login');
                    }
                  }}
                  className="p-2.5 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileDropdownOpen && isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user?.username}</p>
                            <p className='text-sm text-gray-500'>{user?.role === 'admin' ? 'Administrator' : 'Customer'}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        {user?.role === 'admin' ? (
                          <>
                            <Link
                              to="/admin"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-gray-700 hover:text-black font-medium"
                            >
                              <Shield className="w-4 h-4 mr-3 text-gray-500" />
                              Admin Dashboard
                            </Link>
                            
                            <Link
                              to="/admin/products"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-gray-700 hover:text-black font-medium"
                            >
                              <Settings className="w-4 h-4 mr-3 text-gray-500" />
                              Manage Products
                            </Link>
                            
                            <Link
                              to="/track-order"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-gray-700 hover:text-black font-medium"
                            >
                              <Package className="w-4 h-4 mr-3 text-gray-500" />
                              Track Order
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/profile"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-gray-700 hover:text-black font-medium"
                            >
                              <User className="w-4 h-4 mr-3 text-gray-500" />
                              My Profile
                            </Link>
                            
                            <Link
                              to="/orders"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-gray-700 hover:text-black font-medium"
                            >
                              <ShoppingCart className="w-4 h-4 mr-3 text-gray-500" />
                              My Orders
                            </Link>
                            
                            <Link
                              to="/track-order"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-gray-700 hover:text-black font-medium"
                            >
                              <Package className="w-4 h-4 mr-3 text-gray-500" />
                              Track Order
                            </Link>
                          </>
                        )}
                        
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={() => {
                              logout();
                              setProfileDropdownOpen(false);
                              navigate('/');
                            }}
                            className="flex items-center w-full px-4 py-2.5 text-sm hover:bg-red-50 hover:text-red-600 transition-colors text-gray-700 font-medium"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button 
                onClick={() => setCartOpen(true)}
                className="p-2.5 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors relative"
              >
                <svg aria-hidden="true" fill="none" focusable="false" width="20" height="20" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.5 1.5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-13Zm1 0v13h11v-13h-11Z" fill="currentColor"></path>
                  <path d="M7 4.5a3 3 0 1 1 6 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Icons */}
            <div className="flex lg:hidden items-center space-x-2">
              <button 
                onClick={() => navigate('/products')}
                className="p-2.5 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => setCartOpen(true)}
                className="p-2.5 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors relative"
              >
                <svg aria-hidden="true" fill="none" focusable="false" width="20" height="20" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.5 1.5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-13Zm1 0v13h11v-13h-11Z" fill="currentColor"></path>
                  <path d="M7 4.5a3 3 0 1 1 6 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-40 w-full max-w-sm bg-white shadow-2xl lg:hidden"
          >
            <div className="h-full overflow-y-auto p-6 pt-24">
              <div className="space-y-6">
                {/* Main Categories */}
                <div className="space-y-2">
                  <h3 className="text-black font-bold text-base mb-3">Categories</h3>
                  {mainCategories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 px-4 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors font-semibold text-base"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                {/* More Options */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <h3 className="text-black font-bold text-base mb-3">More</h3>
                  <Link
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-4 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm"
                  >
                    All Products
                  </Link>
                  <Link
                    to="/products?category=pants"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-4 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm"
                  >
                    Riding Pants
                  </Link>
                  <Link
                    to="/products?category=protection"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-4 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm"
                  >
                    Protective Gear
                  </Link>
                  <Link
                    to="/products?category=luggage"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-4 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm"
                  >
                    Luggage
                  </Link>
                  <Link
                    to="/products?category=accessories"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-4 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm"
                  >
                    Accessories
                  </Link>
                </div>

                {/* Info Pages */}
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <Link
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg font-semibold text-base transition-colors"
                  >
                    About Us
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg font-semibold text-base transition-colors"
                  >
                    Contact
                  </Link>
                </div>

                {/* Mobile Profile Section */}
                <div className="pt-6 border-t border-gray-200">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 px-2 py-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-semibold">{user?.username}</p>
                          <p className="text-gray-500 text-sm">{user?.role === 'admin' ? 'Administrator' : 'Customer'}</p>
                        </div>
                      </div>
                      
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors font-medium"
                      >
                        <Shield className="w-4 h-4 mr-3 text-gray-500" />
                        Admin Dashboard
                      </Link>
                      
                      <Link
                        to="/track-order"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors font-medium"
                      >
                        <Package className="w-4 h-4 mr-3 text-gray-500" />
                        Track Order
                      </Link>
                      
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                          navigate('/');
                        }}
                        className="flex items-center w-full px-4 py-2.5 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/login');
                        }}
                        className="flex items-center w-full px-4 py-2.5 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors font-medium"
                      >
                        <User className="w-4 h-4 mr-3 text-gray-500" />
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/signup');
                        }}
                        className="flex items-center w-full px-4 py-2.5 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors font-medium"
                      >
                        <User className="w-4 h-4 mr-3 text-gray-500" />
                        Sign Up
                      </button>
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            navigate('/admin/login');
                          }}
                          className="flex items-center w-full px-4 py-2.5 bg-black text-white hover:bg-gray-800 rounded-lg transition-colors font-medium"
                        >
                          <Shield className="w-4 h-4 mr-3" />
                          Admin Login
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="text-xl font-bold text-left">Shopping Cart ({cartCount})</SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg aria-hidden="true" fill="none" focusable="false" width="48" height="48" viewBox="0 0 20 20" className="text-gray-400">
                    <path fillRule="evenodd" d="M3.5 1.5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-13Zm1 0v13h11v-13h-11Z" fill="currentColor"></path>
                    <path d="M7 4.5a3 3 0 1 1 6 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some products to get started!</p>
                <Button onClick={() => { setCartOpen(false); navigate('/products'); }}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const uniqueKey = `${item.id}-${item.size || 'no-size'}`;
                  return (
                    <div key={uniqueKey} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                      />
                      <div className="flex-1 min-w-0 flex flex-col">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1.5">{item.name}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500">{item.category}</span>
                            {item.size && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-gray-600 font-medium">Size: {item.size}</span>
                              </>
                            )}
                          </div>
                          <p className="text-base font-bold text-gray-900">₹{item.price.toLocaleString('en-IN')}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                              className="p-2 hover:bg-gray-50 transition-colors rounded-l-lg"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-4 py-1.5 text-sm font-bold min-w-[2.5rem] text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                              className="p-2 hover:bg-gray-50 transition-colors rounded-r-lg"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {cartItems.length > 0 && (
            <div className="border-t bg-white">
              <div className="p-6 space-y-4">
                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-base font-semibold text-gray-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-sm text-gray-600">Shipping</span>
                    <span className="text-xs text-gray-500 text-right">Calculated at<br/>checkout</span>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                {/* PIN Code Checker */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs font-medium text-gray-600">Check Delivery</span>
                  </div>
                  
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Enter PIN code"
                      value={pinCode}
                      onChange={(e) => handlePinCodeChange(e.target.value)}
                      maxLength={6}
                      className="pr-8 h-8 text-xs border-gray-200 focus:border-gray-300"
                    />
                    {isCheckingDelivery && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {deliveryInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 border border-gray-200 rounded-md p-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="text-gray-700 font-medium">
                            {deliveryInfo.city}, {deliveryInfo.state}
                          </span>
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
                      <div className="mt-1 text-xs text-gray-500">
                        📍 Location will be auto-filled at checkout
                      </div>
                    </motion.div>
                  )}
                  
                  {pinCode && pinCode.length === 6 && !deliveryInfo && !isCheckingDelivery && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-50 border border-red-200 rounded-md p-2"
                    >
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        <span className="text-xs font-medium text-red-700">
                          Delivery not available
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <Separator className="my-3" />
                
                {/* Total */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-black text-black">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <Button 
                    className="w-full bg-black text-white hover:bg-gray-900 h-12 text-base font-bold shadow-lg transition-all hover:shadow-xl"
                    onClick={() => {
                      setCartOpen(false);
                      navigate('/checkout', { 
                        state: { 
                          pinCode: pinCode,
                          deliveryInfo: deliveryInfo 
                        } 
                      });
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-11 text-sm font-medium border-2 hover:bg-gray-50"
                    onClick={() => { setCartOpen(false); navigate('/products'); }}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Navbar;
