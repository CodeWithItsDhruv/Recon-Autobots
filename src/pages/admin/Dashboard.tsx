import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Edit,
  Trash2,
  Plus,
  LogOut,
  User,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  BarChart3,
  Calendar,
  Filter,
  Download,
  Search,
  Settings,
  RefreshCw,
  Bell,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  TrendingDown,
  Activity,
  Target,
  Zap,
  AlertTriangle,
  FileText,
  Percent
} from 'lucide-react';
import { toast } from 'sonner';

// Enhanced mock data with more realistic business metrics
const mockData = {
  stats: [
    {
      title: 'Total Revenue',
      value: '₹2,45,890',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'vs last month',
      target: '₹3,00,000',
      progress: 82
    },
    {
      title: 'Total Orders',
      value: '1,847',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'vs last month',
      target: '2,000',
      progress: 92
    },
    {
      title: 'Products',
      value: '342',
      change: '+2.1%',
      trend: 'up',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'active products',
      target: '400',
      progress: 86
    },
    {
      title: 'Customers',
      value: '8,429',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'total customers',
      target: '10,000',
      progress: 84
    }
  ],
  recentOrders: [
    {
      id: '#ORD-2024-001',
      customer: 'Rajesh Kumar',
      email: 'rajesh@email.com',
      phone: '+91 98765 43210',
      products: ['APEX Pro Riding Jacket', 'Carbon Fiber Helmet'],
      total: '₹21,498',
      status: 'pending',
      date: '2025-01-15T10:30:00Z',
      paymentStatus: 'paid',
      priority: 'high'
    },
    {
      id: '#ORD-2024-002',
      customer: 'Priya Singh',
      email: 'priya@email.com',
      phone: '+91 87654 32109',
      products: ['Leather Riding Gloves'],
      total: '₹2,999',
      status: 'processing',
      date: '2025-01-15T08:20:00Z',
      paymentStatus: 'paid',
      priority: 'medium'
    },
    {
      id: '#ORD-2024-003',
      customer: 'Amit Sharma',
      email: 'amit@email.com',
      phone: '+91 76543 21098',
      products: ['Racing Boots', 'Protective Knee Guards'],
      total: '₹8,497',
      status: 'shipped',
      date: '2025-01-14T15:45:00Z',
      paymentStatus: 'paid',
      priority: 'low'
    },
    {
      id: '#ORD-2024-004',
      customer: 'Neha Patel',
      email: 'neha@email.com',
      phone: '+91 65432 10987',
      products: ['Full Face Helmet'],
      total: '₹12,999',
      status: 'delivered',
      date: '2025-01-14T12:30:00Z',
      paymentStatus: 'paid',
      priority: 'medium'
    },
    {
      id: '#ORD-2024-005',
      customer: 'Vikram Gupta',
      email: 'vikram@email.com',
      phone: '+91 54321 09876',
      products: ['Riding Jacket', 'Gloves Set'],
      total: '₹15,498',
      status: 'cancelled',
      date: '2025-01-13T09:15:00Z',
      paymentStatus: 'refunded',
      priority: 'high'
    }
  ],
  lowStockProducts: [
    {
      id: 1,
      name: 'APEX Pro Riding Jacket',
      sku: 'APX-RJ-001',
      stock: 5,
      minStock: 10,
      price: '₹12,999',
      image: '/src/assets/product-1.jpg',
      category: 'Jackets',
      supplier: 'APEX Gear Ltd.'
    },
    {
      id: 2,
      name: 'Carbon Fiber Helmet',
      sku: 'CFH-001',
      stock: 3,
      minStock: 8,
      price: '₹18,999',
      image: '/src/assets/product-2.jpg',
      category: 'Helmets',
      supplier: 'Carbon Pro Inc.'
    },
    {
      id: 3,
      name: 'Racing Boots',
      sku: 'RB-001',
      stock: 7,
      minStock: 15,
      price: '₹8,999',
      image: '/src/assets/product-3.jpg',
      category: 'Boots',
      supplier: 'Speed Gear Co.'
    }
  ],
  analytics: {
    salesChart: [
      { month: 'Jan', sales: 45000, orders: 320, customers: 180 },
      { month: 'Feb', sales: 52000, orders: 380, customers: 220 },
      { month: 'Mar', sales: 48000, orders: 350, customers: 200 },
      { month: 'Apr', sales: 61000, orders: 420, customers: 280 },
      { month: 'May', sales: 55000, orders: 390, customers: 250 },
      { month: 'Jun', sales: 67000, orders: 480, customers: 320 }
    ],
    topCategories: [
      { name: 'Helmets', sales: 89450, percentage: 35, orders: 245, growth: 12 },
      { name: 'Jackets', sales: 67230, percentage: 28, orders: 189, growth: 8 },
      { name: 'Gloves', sales: 45120, percentage: 18, orders: 156, growth: 15 },
      { name: 'Boots', sales: 32890, percentage: 13, orders: 98, growth: 5 },
      { name: 'Accessories', sales: 15670, percentage: 6, orders: 67, growth: 22 }
    ],
    recentActivity: [
      { action: 'New order received', details: '#ORD-2024-001 - ₹21,498', time: '5 min ago', type: 'order' },
      { action: 'Product stock updated', details: 'APEX Pro Jacket - 15 units', time: '12 min ago', type: 'inventory' },
      { action: 'Customer registered', details: 'Rajesh Kumar joined', time: '18 min ago', type: 'customer' },
      { action: 'Payment received', details: '#ORD-2024-002 - ₹2,999', time: '25 min ago', type: 'payment' },
      { action: 'Order shipped', details: '#ORD-2024-003 via BlueDart', time: '1 hour ago', type: 'shipping' }
    ]
  },
  notifications: [
    { id: 1, message: 'Low stock alert: Carbon Fiber Helmet (3 left)', type: 'warning', time: '10 min ago' },
    { id: 2, message: 'New order #ORD-2024-001 requires attention', type: 'info', time: '15 min ago' },
    { id: 3, message: 'Monthly sales target 82% achieved', type: 'success', time: '1 hour ago' },
    { id: 4, message: 'System backup completed successfully', type: 'success', time: '2 hours ago' }
  ]
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Real-time data refresh simulation
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
    toast.success('Dashboard data refreshed successfully!');
  };

  // Export functionality
  const handleExportData = (type: string) => {
    let csvData = '';
    let filename = '';
    
    switch (type) {
      case 'Sales':
        csvData = `Month,Revenue,Orders,Customers\n${mockData.analytics.salesChart.map(item => 
          `${item.month},${item.sales},${item.orders || 'N/A'},${item.customers || 'N/A'}`
        ).join('\n')}`;
        filename = 'sales-report';
        break;
      case 'Orders':
        csvData = `Order ID,Customer,Email,Products,Total,Status,Date\n${mockData.recentOrders.map(order => 
          `${order.id},"${order.customer}",${order.email},"${order.products.join('; ')}",${order.total},${order.status},${order.date}`
        ).join('\n')}`;
        filename = 'orders-report';
        break;
      default:
        csvData = `Type,Value,Date\nExport,${type},${new Date().toISOString()}`;
        filename = 'general-report';
    }
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success(`${type} data exported successfully!`);
  };

  // Analytics navigation
  const handleAnalyticsView = (view: string) => {
    navigate('/admin/analytics');
  };

  // Order actions
  const handleOrderAction = (orderId: string, action: string) => {
    toast.success(`Order ${orderId} ${action} successfully!`);
    // In real app, this would update order status
  };

  // Product actions
  const handleProductAction = (productId: number, action: string) => {
    toast.success(`Product ${action} successfully!`);
    // In real app, this would update product
  };

  // Contact customer
  const handleContactCustomer = (customer: { customer: string; email: string; phone: string }, method: string) => {
    if (method === 'email') {
      window.location.href = `mailto:${customer.email}`;
    } else if (method === 'phone') {
      window.location.href = `tel:${customer.phone}`;
    }
    toast.info(`Opening ${method} to contact ${customer.customer}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'processing': return <Package className="w-3 h-3" />;
      case 'shipped': return <Truck className="w-3 h-3" />;
      case 'delivered': return <CheckCircle className="w-3 h-3" />;
      case 'cancelled': return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-green-500';
      default: return 'border-l-4 border-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | RECON AUTOBOTS</title>
        <meta name="description" content="RECON AUTOBOTS admin dashboard - manage products, orders, and analytics" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-4 h-4" />
                </Button>
                
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-3 border-b">
                      <h3 className="font-medium">Notifications</h3>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {mockData.notifications.map((notification) => (
                        <div key={notification.id} className="p-3 border-b last:border-b-0 hover:bg-gray-50">
                          <p className="text-sm text-gray-900">{notification.message}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Refresh */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefreshData}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{user?.displayName || 'Admin'}</span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Quick Actions */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => navigate('/admin/products')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/admin/orders')}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Orders
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/admin/analytics')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/admin/coupons')}
              >
                <Percent className="w-4 h-4 mr-2" />
                Coupons
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleExportData('Sales')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/admin/inventory')}
              >
                <Package className="w-4 h-4 mr-2" />
                Inventory
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/admin/settings')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {mockData.stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                        <div className="flex items-center mt-1">
                          {stat.trend === 'up' ? (
                            <ArrowUpRight className="w-3 h-3 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-red-600" />
                          )}
                          <span className={`text-xs ml-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <Card className="h-96">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle>Recent Orders</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleExportData('Orders')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Link to="/admin/orders">
                      <Button variant="outline" size="sm">
                        View All
                        <ArrowUpRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-72 overflow-y-auto px-6 space-y-3">
                    {mockData.recentOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className="p-3 bg-gray-50 rounded border-l-2 border-gray-300 hover:border-blue-500 cursor-pointer transition-colors"
                        onClick={() => setSelectedOrderId(selectedOrderId === order.id ? null : order.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{order.id}</h4>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                          <span className="font-medium text-gray-900">{order.total}</span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm text-gray-900 font-medium">{order.customer}</p>
                            <p className="text-xs text-gray-500">{order.email}</p>
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(order.date)}</span>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-3">{order.products.join(', ')}</p>
                        
                        {selectedOrderId === order.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="border-t pt-3 mt-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/admin/orders`);
                                  }}
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOrderAction(order.id, 'updated');
                                  }}
                                >
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleContactCustomer(order, 'email');
                                  }}
                                >
                                  <Mail className="w-3 h-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleContactCustomer(order, 'phone');
                                  }}
                                >
                                  <Phone className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Low Stock Alert */}
            <div>
              <Card className="h-96">
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-600">
                    Low Stock
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-72 overflow-y-auto px-6 space-y-3">
                    {mockData.lowStockProducts.map((product) => (
                      <div key={product.id} className="p-3 border rounded">
                        <div className="flex items-center space-x-3 mb-2">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{product.name}</h4>
                            <p className="text-xs text-gray-500">{product.sku}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-orange-600">
                            {product.stock} left
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleProductAction(product.id, 'restocked')}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 pb-6">
                    <Link to="/admin/products">
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        <Package className="w-4 h-4 mr-2" />
                        Manage All Inventory
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Sales Overview</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={timeRange === '7d' ? 'default' : 'ghost'} 
                      size="sm"
                      onClick={() => setTimeRange('7d')}
                    >
                      7D
                    </Button>
                    <Button 
                      variant={timeRange === '30d' ? 'default' : 'ghost'} 
                      size="sm"
                      onClick={() => setTimeRange('30d')}
                    >
                      30D
                    </Button>
                    <Button 
                      variant={timeRange === '90d' ? 'default' : 'ghost'} 
                      size="sm"
                      onClick={() => setTimeRange('90d')}
                    >
                      90D
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockData.analytics.salesChart}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Sales']}
                        labelStyle={{ color: '#374151' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">₹67K</p>
                    <p className="text-xs text-gray-500">This Month</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">480</p>
                    <p className="text-xs text-gray-500">Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">320</p>
                    <p className="text-xs text-gray-500">Customers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Top Categories</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAnalyticsView('Category Performance')}
                  >
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-48 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockData.analytics.topCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="percentage"
                      >
                        {mockData.analytics.topCategories.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={[
                              '#3B82F6', // Blue
                              '#10B981', // Green  
                              '#F59E0B', // Yellow
                              '#EF4444', // Red
                              '#8B5CF6'  // Purple
                            ][index % 5]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number, name: string, props: { payload: { name: string } }) => [
                          `${value}%`,
                          props.payload.name
                        ]}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2">
                  {mockData.analytics.topCategories.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: [
                            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
                          ][index % 5] }}
                        ></div>
                        <span>{category.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">₹{(category.sales/1000).toFixed(0)}K</span>
                        <span className="text-green-600 ml-2 text-xs">+{category.growth}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockData.analytics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;