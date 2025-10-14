import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Search, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Download,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import orderService, { Order } from '@/lib/orders';
import invoiceService from '@/lib/invoice';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trackingQuery, setTrackingQuery] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  const loadOrders = async () => {
    try {
      const allOrders = await orderService.getAllOrders();
      
      // For demo purposes, show all orders if user is logged in
      // In production, you would filter by user ID
      let userOrders = allOrders;
      
      if (user?.email) {
        // Show orders for the current user, or demo orders if no user orders exist
        const userSpecificOrders = allOrders.filter(order => 
          order.customer.email === user.email
        );
        
        // If user has no orders, show demo orders for demonstration
        if (userSpecificOrders.length === 0) {
          userOrders = allOrders; // Show all demo orders
        } else {
          userOrders = userSpecificOrders;
        }
      }
      
      setOrders(userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
      setOrders([]);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const downloadInvoice = (order: Order) => {
    try {
      invoiceService.generateInvoice(order);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  const trackOrder = async (trackingNumber: string) => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setIsTracking(true);
    try {
      // Open BlueDart tracking in new tab
      const blueDartUrl = `https://www.bluedart.com/track/${trackingNumber}`;
      window.open(blueDartUrl, '_blank');
      toast.success('Opening BlueDart tracking page...');
    } catch (error) {
      toast.error('Failed to open tracking page');
    } finally {
      setIsTracking(false);
    }
  };

  const trackOrderByNumber = async () => {
    if (!trackingQuery.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    await trackOrder(trackingQuery.trim());
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><CheckCircle className="w-3 h-3 mr-1" />Confirmed</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200"><Truck className="w-3 h-3 mr-1" />Shipped</Badge>;
      case 'delivered':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your orders</h1>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Orders & Tracking - RECON AUTOBOTS</title>
        <meta name="description" content="View and track your order history with BlueDart tracking" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders & Tracking</h1>
            <p className="text-gray-600 mt-2">View your order history and track shipments with BlueDart</p>
            {orders.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Demo Mode:</strong> Showing sample orders for demonstration. In production, you would see only your actual orders.
                </p>
              </div>
            )}
          </div>

          {/* Quick Tracking Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Quick Order Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Enter BlueDart tracking number (e.g., BD1234567890)"
                      value={trackingQuery}
                      onChange={(e) => setTrackingQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button 
                  onClick={trackOrderByNumber}
                  disabled={isTracking}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isTracking ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Track on BlueDart
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Enter your BlueDart tracking number to track your shipment on the official BlueDart website
              </p>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search orders by order number, customer name, or product..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {orders.length === 0 ? 'No orders found' : 'No orders match your filters'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {orders.length === 0 
                    ? 'You haven\'t placed any orders yet. Start shopping to see your orders here.'
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
                {orders.length === 0 && (
                  <Button onClick={() => navigate('/products')}>
                    Start Shopping
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">{order.orderNumber}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.date)}
                          </p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadInvoice(order)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Invoice
                        </Button>
                        {order.trackingNumber && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => trackOrder(order.trackingNumber)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Track BlueDart
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Order Items */}
                      <div className="lg:col-span-2">
                        <h4 className="font-semibold mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">
                                  Size: {item.size} • Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-3">Order Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax:</span>
                              <span>{formatCurrency(order.tax)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping:</span>
                              <span>{formatCurrency(order.shipping)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg border-t pt-2">
                              <span>Total:</span>
                              <span>{formatCurrency(order.total)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">Payment & Shipping</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-gray-500" />
                              <span>{order.paymentMethod}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span>{order.customer.city}, {order.customer.state}</span>
                            </div>
                            {order.trackingNumber && (
                              <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-gray-500" />
                                <span>Tracking: {order.trackingNumber}</span>
                              </div>
                            )}
                            {order.estimatedDelivery && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span>Est. Delivery: {order.estimatedDelivery}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
