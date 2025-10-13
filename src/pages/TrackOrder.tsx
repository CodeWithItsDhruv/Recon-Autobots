import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Package, 
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  AlertCircle,
  Home
} from 'lucide-react';

// Mock tracking data - in real app, this would come from API
const mockTrackingData = {
  'TRK123456789': {
    orderId: '#ORD-2024-002',
    status: 'in_transit',
    courier: 'BlueDart',
    estimatedDelivery: '2025-01-19T18:00:00Z',
    currentLocation: 'Mumbai Sorting Facility',
    customerInfo: {
      name: 'Priya Singh',
      phone: '+91 87654 32109'
    },
    shippingAddress: {
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400058'
    },
    timeline: [
      {
        status: 'Order Shipped',
        location: 'Warehouse - Gurgaon',
        timestamp: '2025-01-15T18:00:00Z',
        description: 'Your order has been shipped and is on its way'
      },
      {
        status: 'In Transit',
        location: 'Delhi Hub',
        timestamp: '2025-01-16T08:30:00Z',
        description: 'Package is in transit to destination city'
      },
      {
        status: 'Reached Destination City',
        location: 'Mumbai Sorting Facility',
        timestamp: '2025-01-17T14:20:00Z',
        description: 'Package has reached Mumbai and is being sorted for delivery'
      },
      {
        status: 'Out for Delivery',
        location: 'Mumbai - Andheri West',
        timestamp: '2025-01-18T09:00:00Z',
        description: 'Package is out for delivery and will be delivered today',
        expected: true
      }
    ]
  },
  'TRK987654321': {
    orderId: '#ORD-2024-003',
    status: 'delivered',
    courier: 'FedEx',
    estimatedDelivery: '2025-01-17T18:00:00Z',
    currentLocation: 'Delivered',
    customerInfo: {
      name: 'Amit Sharma',
      phone: '+91 76543 21098'
    },
    shippingAddress: {
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    },
    timeline: [
      {
        status: 'Order Shipped',
        location: 'Warehouse - Gurgaon',
        timestamp: '2025-01-14T16:30:00Z',
        description: 'Your order has been shipped'
      },
      {
        status: 'In Transit',
        location: 'Bangalore Hub',
        timestamp: '2025-01-16T10:15:00Z',
        description: 'Package is in transit'
      },
      {
        status: 'Out for Delivery',
        location: 'Bangalore - Brigade Road',
        timestamp: '2025-01-17T09:00:00Z',
        description: 'Package is out for delivery'
      },
      {
        status: 'Delivered',
        location: 'Delivered to Customer',
        timestamp: '2025-01-17T15:30:00Z',
        description: 'Package delivered successfully to Amit Sharma'
      }
    ]
  }
};

const TrackOrder = () => {
  const [trackingId, setTrackingId] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const data = mockTrackingData[trackingId as keyof typeof mockTrackingData];
    if (data) {
      setTrackingData(data);
    } else {
      setError('Tracking ID not found. Please check your tracking number and try again.');
      setTrackingData(null);
    }
    
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-purple-100 text-purple-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'shipped': return <Package className="w-4 h-4" />;
      case 'in_transit': return <Truck className="w-4 h-4" />;
      case 'out_for_delivery': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'shipped': return 25;
      case 'in_transit': return 50;
      case 'out_for_delivery': return 75;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  return (
    <>
      <Helmet>
        <title>Track Your Order | RECON AUTOBOTS</title>
        <meta name="description" content="Track your RECON AUTOBOTS order with your tracking ID" />
      </Helmet>

      <Navbar />
      
      <main className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
            <p className="text-lg text-gray-600">
              Enter your tracking ID to get real-time updates on your order
            </p>
          </motion.div>

          {/* Tracking Form */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter your tracking ID (e.g., TRK123456789)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                    className="pl-12 h-12 text-lg"
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isLoading}
                  className="h-12 px-8"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Tracking...
                    </div>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Track Order
                    </>
                  )}
                </Button>
              </form>
              
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-700">{error}</span>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Demo Tracking IDs */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-900 mb-3">Try these demo tracking IDs:</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTrackingId('TRK123456789')}
                  className="bg-white hover:bg-blue-50"
                >
                  TRK123456789 (In Transit)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTrackingId('TRK987654321')}
                  className="bg-white hover:bg-blue-50"
                >
                  TRK987654321 (Delivered)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Results */}
          {trackingData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Order Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Order Status</span>
                    <Badge className={`${getStatusColor(trackingData.status)} flex items-center gap-2 text-sm px-3 py-1`}>
                      {getStatusIcon(trackingData.status)}
                      {trackingData.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Order Progress</span>
                      <span>{getProgressPercentage(trackingData.status)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${getProgressPercentage(trackingData.status)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Order ID</p>
                          <p className="text-gray-600">{trackingData.orderId}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Truck className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Courier</p>
                          <p className="text-gray-600">{trackingData.courier}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Current Location</p>
                          <p className="text-gray-600">{trackingData.currentLocation}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Estimated Delivery</p>
                          <p className="text-gray-600">{formatDate(trackingData.estimatedDelivery)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Delivery Address</p>
                          <p className="text-gray-600">
                            {trackingData.shippingAddress.city}, {trackingData.shippingAddress.state} - {trackingData.shippingAddress.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Courier Tracking Link */}
                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Track on {trackingData.courier} Website
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Tracking Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trackingData.timeline.map((event: any, index: number) => (
                      <div key={index} className={`flex items-start space-x-4 pb-4 ${index !== trackingData.timeline.length - 1 ? 'border-b' : ''}`}>
                        <div className={`w-3 h-3 rounded-full mt-2 ${event.expected ? 'bg-orange-500' : 'bg-blue-600'}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900">{event.status}</h4>
                            <span className="text-sm text-gray-500">{formatDate(event.timestamp)}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-1">{event.location}</p>
                          <p className="text-gray-500 text-sm">{event.description}</p>
                          {event.expected && (
                            <Badge className="mt-2 bg-orange-100 text-orange-800">
                              Expected
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="font-semibold text-gray-900">Need Help?</h3>
                    <p className="text-gray-600">
                      If you have any questions about your order, our support team is here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <Button variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Support
                      </Button>
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Support
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* How to Track Guide */}
          {!trackingData && !isLoading && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>How to Track Your Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">1. Enter Tracking ID</h3>
                    <p className="text-sm text-gray-600">
                      Enter the tracking ID sent to your email after your order is shipped
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Truck className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">2. View Status</h3>
                    <p className="text-sm text-gray-600">
                      See real-time updates on your package location and delivery status
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold mb-2">3. Get Delivered</h3>
                    <p className="text-sm text-gray-600">
                      Track your package until it's safely delivered to your doorstep
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link to="/">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default TrackOrder;
