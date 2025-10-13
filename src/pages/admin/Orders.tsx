import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Eye, 
  Edit, 
  Truck,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  Download,
  LogOut,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  AlertTriangle,
  Send,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

// Enhanced order interface
interface OrderItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  sku: string;
}

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  total: string;
  subtotal: string;
  tax: string;
  shipping: string;
  discount?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  date: string;
  expectedDelivery?: string;
  shippingAddress: ShippingAddress;
  trackingId?: string;
  courier?: string;
  notes?: string;
  timeline: {
    status: string;
    timestamp: string;
    note?: string;
  }[];
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '#ORD-2024-001',
    customer: {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210'
    },
    items: [
      {
        id: 1,
        name: 'APEX Pro Riding Jacket',
        price: '₹12,999',
        quantity: 1,
        image: '/src/assets/product-1.jpg',
        sku: 'APX-RJ-001'
      },
      {
        id: 2,
        name: 'Carbon Fiber Helmet',
        price: '₹8,499',
        quantity: 1,
        image: '/src/assets/product-2.jpg',
        sku: 'CFH-001'
      }
    ],
    subtotal: '₹21,498',
    tax: '₹3,870',
    shipping: '₹0',
    total: '₹25,368',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    date: '2025-01-15T10:30:00Z',
    expectedDelivery: '2025-01-20T18:00:00Z',
    shippingAddress: {
      name: 'Rajesh Kumar',
      address: '123 MG Road, Sector 15',
      city: 'Gurgaon',
      state: 'Haryana',
      pincode: '122001',
      phone: '+91 98765 43210'
    },
    timeline: [
      {
        status: 'Order Placed',
        timestamp: '2025-01-15T10:30:00Z'
      },
      {
        status: 'Payment Confirmed',
        timestamp: '2025-01-15T10:35:00Z'
      },
      {
        status: 'Order Confirmed',
        timestamp: '2025-01-15T11:00:00Z',
        note: 'Order confirmed and being prepared for dispatch'
      }
    ]
  },
  {
    id: '#ORD-2024-002',
    customer: {
      name: 'Priya Singh',
      email: 'priya.singh@email.com',
      phone: '+91 87654 32109'
    },
    items: [
      {
        id: 3,
        name: 'Leather Riding Gloves',
        price: '₹2,999',
        quantity: 2,
        image: '/src/assets/product-3.jpg',
        sku: 'LRG-001'
      }
    ],
    subtotal: '₹5,998',
    tax: '₹1,080',
    shipping: '₹150',
    total: '₹7,228',
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    date: '2025-01-14T15:20:00Z',
    expectedDelivery: '2025-01-19T18:00:00Z',
    trackingId: 'TRK123456789',
    courier: 'BlueDart',
    shippingAddress: {
      name: 'Priya Singh',
      address: '456 Park Street, Andheri West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400058',
      phone: '+91 87654 32109'
    },
    timeline: [
      {
        status: 'Order Placed',
        timestamp: '2025-01-14T15:20:00Z'
      },
      {
        status: 'Payment Confirmed',
        timestamp: '2025-01-14T15:25:00Z'
      },
      {
        status: 'Order Confirmed',
        timestamp: '2025-01-14T16:00:00Z'
      },
      {
        status: 'Processing',
        timestamp: '2025-01-15T09:00:00Z'
      },
      {
        status: 'Shipped',
        timestamp: '2025-01-15T18:00:00Z',
        note: 'Package shipped via BlueDart - Tracking ID: TRK123456789'
      }
    ]
  },
  {
    id: '#ORD-2024-003',
    customer: {
      name: 'Amit Sharma',
      email: 'amit.sharma@email.com',
      phone: '+91 76543 21098'
    },
    items: [
      {
        id: 4,
        name: 'Racing Boots',
        price: '₹8,999',
        quantity: 1,
        image: '/src/assets/product-1.jpg',
        sku: 'RB-001'
      }
    ],
    subtotal: '₹8,999',
    tax: '₹1,620',
    shipping: '₹200',
    total: '₹10,819',
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'Net Banking',
    date: '2025-01-12T12:15:00Z',
    expectedDelivery: '2025-01-17T18:00:00Z',
    trackingId: 'TRK987654321',
    courier: 'FedEx',
    shippingAddress: {
      name: 'Amit Sharma',
      address: '789 Brigade Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      phone: '+91 76543 21098'
    },
    timeline: [
      {
        status: 'Order Placed',
        timestamp: '2025-01-12T12:15:00Z'
      },
      {
        status: 'Payment Confirmed',
        timestamp: '2025-01-12T12:20:00Z'
      },
      {
        status: 'Order Confirmed',
        timestamp: '2025-01-12T13:00:00Z'
      },
      {
        status: 'Processing',
        timestamp: '2025-01-13T10:00:00Z'
      },
      {
        status: 'Shipped',
        timestamp: '2025-01-14T16:30:00Z'
      },
      {
        status: 'Out for Delivery',
        timestamp: '2025-01-17T09:00:00Z'
      },
      {
        status: 'Delivered',
        timestamp: '2025-01-17T15:30:00Z',
        note: 'Package delivered successfully'
      }
    ]
  }
];

const AdminOrders = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingData, setTrackingData] = useState({ trackingId: '', courier: '' });

  const statuses = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  const paymentStatuses = ['all', 'pending', 'paid', 'failed', 'refunded'];
  const couriers = ['BlueDart', 'FedEx', 'DHL', 'India Post', 'Delhivery', 'Ecom Express'];

  // Filtering logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.trackingId?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
      
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'confirmed': return <CheckCircle className="w-3 h-3" />;
      case 'processing': return <Package className="w-3 h-3" />;
      case 'shipped': return <Truck className="w-3 h-3" />;
      case 'delivered': return <CheckCircle className="w-3 h-3" />;
      case 'cancelled': return <XCircle className="w-3 h-3" />;
      case 'refunded': return <AlertTriangle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? {
            ...order,
            status: newStatus,
            timeline: [
              ...order.timeline,
              {
                status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
                timestamp: new Date().toISOString(),
                note: `Status updated to ${newStatus}`
              }
            ]
          }
        : order
    ));
  };

  const handleAddTracking = (orderId: string, trackingId: string, courier: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? {
            ...order,
            trackingId,
            courier,
            status: 'shipped',
            timeline: [
              ...order.timeline,
              {
                status: 'Shipped',
                timestamp: new Date().toISOString(),
                note: `Package shipped via ${courier} - Tracking ID: ${trackingId}`
              }
            ]
          }
        : order
    ));
    setShowTrackingModal(false);
    setTrackingData({ trackingId: '', courier: '' });
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

  const OrderDetailsModal = ({ order, onClose }: { order: Order; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Order Details - {order.id}</h2>
            <Button variant="ghost" onClick={onClose}>
              <XCircle className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Status:</span>
                    <Badge className={order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Method:</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Order Date:</span>
                    <span className="font-medium">{formatDate(order.date)}</span>
                  </div>
                  {order.expectedDelivery && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Expected Delivery:</span>
                      <span className="font-medium">{formatDate(order.expectedDelivery)}</span>
                    </div>
                  )}
                  {order.trackingId && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tracking ID:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{order.trackingId}</span>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {order.courier && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Courier:</span>
                      <span className="font-medium">{order.courier}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{order.customer.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{order.customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{order.customer.phone}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium">{order.shippingAddress.name}</p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                        {order.shippingAddress.pincode}<br />
                        Phone: {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Items & Timeline */}
            <div className="space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm">Qty: {item.quantity}</span>
                            <span className="font-medium">{item.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{order.subtotal}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Tax:</span>
                      <span>{order.tax}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Shipping:</span>
                      <span>{order.shipping}</span>
                    </div>
                    {order.discount && (
                      <div className="flex items-center justify-between text-sm text-green-600">
                        <span>Discount:</span>
                        <span>-{order.discount}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>{order.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.timeline.map((event, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">{event.status}</p>
                          <p className="text-sm text-gray-600">{formatDate(event.timestamp)}</p>
                          {event.note && (
                            <p className="text-sm text-gray-500 mt-1">{event.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <div className="flex items-center space-x-4">
              <select
                className="p-2 border border-gray-300 rounded-md"
                value={order.status}
                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
              >
                {statuses.filter(s => s !== 'all').map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
              <Button
                onClick={() => {
                  setSelectedOrder(order);
                  setShowTrackingModal(true);
                }}
                disabled={order.status === 'delivered' || order.status === 'cancelled'}
              >
                <Truck className="w-4 h-4 mr-2" />
                Add Tracking
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline"
                onClick={() => {
                  // Generate invoice
                  const invoiceData = `INVOICE - ${order.id}\n\nCustomer: ${order.customer.name}\nEmail: ${order.customer.email}\nPhone: ${order.customer.phone}\n\nItems:\n${order.items.map(item => `${item.name} x${item.quantity} - ${item.price}`).join('\n')}\n\nSubtotal: ${order.subtotal}\nTax: ${order.tax}\nShipping: ${order.shipping}\nTotal: ${order.total}\n\nShipping Address:\n${order.shippingAddress.name}\n${order.shippingAddress.address}\n${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}`;
                  
                  const blob = new Blob([invoiceData], { type: 'text/plain' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `invoice-${order.id}.txt`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                  toast.success('Invoice downloaded successfully!');
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Invoice
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  const subject = `Order Update - ${order.id}`;
                  const body = `Dear ${order.customer.name},\n\nThank you for your order ${order.id}.\n\nOrder Status: ${order.status}\nTotal Amount: ${order.total}\n\nBest regards,\nRECON AUTOBOTS Team`;
                  window.location.href = `mailto:${order.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  toast.info('Opening email client...');
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Email Customer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Order Management | Admin | RECON AUTOBOTS</title>
        <meta name="description" content="Manage orders in RECON AUTOBOTS admin panel" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{user?.username}</span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select 
                  className="p-2 border border-gray-300 rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                
                <select 
                  className="p-2 border border-gray-300 rounded-md"
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  {paymentStatuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Payments' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                
                <select 
                  className="p-2 border border-gray-300 rounded-md"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    const csvData = `Order ID,Customer,Email,Phone,Status,Payment Status,Total,Date\n${filteredOrders.map(order => 
                      `${order.id},"${order.customer.name}",${order.customer.email},${order.customer.phone},${order.status},${order.paymentStatus},${order.total},${order.date}`
                    ).join('\n')}`;
                    
                    const blob = new Blob([csvData], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    toast.success('Orders exported successfully!');
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Orders Summary */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {filteredOrders.length} of {orders.length} orders
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <h3 className="font-bold text-lg">{order.id}</h3>
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                        <Badge className={order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <select
                          className="p-1 text-sm border border-gray-300 rounded"
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                        >
                          {statuses.filter(s => s !== 'all').map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{order.customer.name}</h4>
                        <p className="text-sm text-gray-600">{order.customer.email}</p>
                        <p className="text-sm text-gray-600">{order.customer.phone}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Items: {order.items.length}</p>
                        <p className="text-sm text-gray-600">
                          {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-bold text-lg text-gray-900">{order.total}</p>
                        <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                        <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                      </div>
                      
                      <div>
                        {order.trackingId ? (
                          <div>
                            <p className="text-sm text-gray-600">Tracking: {order.trackingId}</p>
                            <p className="text-sm text-gray-600">Courier: {order.courier}</p>
                            <Button variant="ghost" size="sm" className="p-0 h-auto">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Track Package
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowTrackingModal(true);
                            }}
                            disabled={order.status === 'delivered' || order.status === 'cancelled'}
                          >
                            <Truck className="w-4 h-4 mr-2" />
                            Add Tracking
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try adjusting your search or filters' : 'No orders have been placed yet'}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && !showTrackingModal && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Add Tracking Modal */}
      {showTrackingModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Add Tracking Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking ID</label>
                <Input
                  value={trackingData.trackingId}
                  onChange={(e) => setTrackingData({...trackingData, trackingId: e.target.value})}
                  placeholder="Enter tracking ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Courier</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={trackingData.courier}
                  onChange={(e) => setTrackingData({...trackingData, courier: e.target.value})}
                >
                  <option value="">Select Courier</option>
                  {couriers.map(courier => (
                    <option key={courier} value={courier}>{courier}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => handleAddTracking(selectedOrder.id, trackingData.trackingId, trackingData.courier)}
                  disabled={!trackingData.trackingId || !trackingData.courier}
                  className="flex-1"
                >
                  Add Tracking
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTrackingModal(false);
                    setTrackingData({ trackingId: '', courier: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminOrders;