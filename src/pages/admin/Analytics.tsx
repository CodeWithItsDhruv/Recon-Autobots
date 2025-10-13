import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Activity,
  Zap,
  LogOut,
  User,
  Eye,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

// Mock analytics data
const analyticsData = {
  overview: {
    totalRevenue: { value: '₹2,45,890', change: '+12.5%', trend: 'up' },
    totalOrders: { value: '1,847', change: '+8.2%', trend: 'up' },
    avgOrderValue: { value: '₹1,332', change: '+5.1%', trend: 'up' },
    conversionRate: { value: '3.2%', change: '-0.3%', trend: 'down' }
  },
  salesData: [
    { month: 'Jan', revenue: 45000, orders: 320, customers: 180 },
    { month: 'Feb', revenue: 52000, orders: 380, customers: 220 },
    { month: 'Mar', revenue: 48000, orders: 350, customers: 200 },
    { month: 'Apr', revenue: 61000, orders: 420, customers: 280 },
    { month: 'May', revenue: 55000, orders: 390, customers: 250 },
    { month: 'Jun', revenue: 67000, orders: 480, customers: 320 }
  ],
  categoryPerformance: [
    { category: 'Helmets', revenue: 89450, orders: 245, growth: 12, percentage: 35 },
    { category: 'Jackets', revenue: 67230, orders: 189, growth: 8, percentage: 28 },
    { category: 'Gloves', revenue: 45120, orders: 156, growth: 15, percentage: 18 },
    { category: 'Boots', revenue: 32890, orders: 98, growth: 5, percentage: 13 },
    { category: 'Accessories', revenue: 15670, orders: 67, growth: 22, percentage: 6 }
  ],
  customerInsights: {
    newCustomers: 156,
    returningCustomers: 423,
    customerLifetimeValue: '₹4,250',
    topCustomerSegment: 'Premium Riders'
  },
  productAnalytics: {
    bestSelling: [
      { name: 'APEX Pro Helmet', sales: 89, revenue: '₹89,000' },
      { name: 'Carbon Fiber Jacket', sales: 67, revenue: '₹67,000' },
      { name: 'Racing Gloves Pro', sales: 45, revenue: '₹45,000' }
    ],
    lowPerforming: [
      { name: 'Basic Knee Guards', sales: 12, revenue: '₹12,000' },
      { name: 'Rain Cover', sales: 8, revenue: '₹8,000' }
    ]
  },
  trafficSources: [
    { source: 'Organic Search', visitors: 2450, percentage: 45 },
    { source: 'Direct', visitors: 1680, percentage: 31 },
    { source: 'Social Media', visitors: 890, percentage: 16 },
    { source: 'Paid Ads', visitors: 435, percentage: 8 }
  ]
};

const AdminAnalytics = () => {
  const { user, logout } = useAuth();
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const handleExport = (type: string) => {
    // Create mock CSV data
    const csvData = `Date,Revenue,Orders,Customers\n${analyticsData.salesData.map(item => 
      `${item.month},${item.revenue},${item.orders},${item.customers}`
    ).join('\n')}`;
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${type}-${dateRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet>
        <title>Analytics | Admin | RECON AUTOBOTS</title>
        <meta name="description" content="Analytics dashboard for RECON AUTOBOTS admin panel" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={dateRange === '7d' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateRange('7d')}
                  >
                    7 Days
                  </Button>
                  <Button
                    variant={dateRange === '30d' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateRange('30d')}
                  >
                    30 Days
                  </Button>
                  <Button
                    variant={dateRange === '90d' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateRange('90d')}
                  >
                    90 Days
                  </Button>
                </div>
                
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
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
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Object.entries(analyticsData.overview).map(([key, data], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">{data.value}</p>
                        <div className="flex items-center mt-2">
                          {data.trend === 'up' ? (
                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-sm ml-1 ${data.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {data.change}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 rounded-full bg-blue-50">
                        {key === 'totalRevenue' && <DollarSign className="w-6 h-6 text-blue-600" />}
                        {key === 'totalOrders' && <ShoppingCart className="w-6 h-6 text-blue-600" />}
                        {key === 'avgOrderValue' && <Target className="w-6 h-6 text-blue-600" />}
                        {key === 'conversionRate' && <TrendingUp className="w-6 h-6 text-blue-600" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales Trend Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Sales Trend</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={selectedMetric === 'revenue' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedMetric('revenue')}
                    >
                      Revenue
                    </Button>
                    <Button
                      variant={selectedMetric === 'orders' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedMetric('orders')}
                    >
                      Orders
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExport('sales')}>
                      <Download className="w-3 h-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-200">
                  <div className="text-center">
                    <LineChart className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-blue-600 font-medium mb-2">Interactive Sales Chart</p>
                    <p className="text-sm text-blue-500 mb-4">Chart.js or Recharts integration ready</p>
                    
                    {/* Mock data visualization */}
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      {analyticsData.salesData.slice(-3).map((item, index) => (
                        <div key={index} className="bg-white p-2 rounded">
                          <p className="font-semibold">{item.month}</p>
                          <p className="text-blue-600">₹{(item.revenue/1000).toFixed(0)}K</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Category Performance</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleExport('categories')}>
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.categoryPerformance.map((category, index) => (
                    <div key={category.category} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{category.category}</p>
                            <p className="text-xs text-gray-600">{category.orders} orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{(category.revenue/1000).toFixed(0)}K</p>
                          <p className="text-xs text-green-600">+{category.growth}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 w-8">{category.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Customer Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Customer Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">New Customers</p>
                      <p className="text-xl font-bold text-green-600">{analyticsData.customerInsights.newCustomers}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Returning Customers</p>
                      <p className="text-xl font-bold text-blue-600">{analyticsData.customerInsights.returningCustomers}</p>
                    </div>
                    <Activity className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Avg. Lifetime Value</p>
                    <p className="text-xl font-bold text-purple-600">{analyticsData.customerInsights.customerLifetimeValue}</p>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Top Segment</p>
                    <p className="font-semibold text-orange-600">{analyticsData.customerInsights.topCustomerSegment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Product Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Best Selling
                    </h4>
                    {analyticsData.productAnalytics.bestSelling.map((product, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.sales} sales</p>
                        </div>
                        <p className="text-sm font-semibold text-green-600">{product.revenue}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2 flex items-center">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      Needs Attention
                    </h4>
                    {analyticsData.productAnalytics.lowPerforming.map((product, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.sales} sales</p>
                        </div>
                        <p className="text-sm font-semibold text-red-600">{product.revenue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.trafficSources.map((source, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{source.source}</p>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{source.visitors.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{source.percentage}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Analytics Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" onClick={() => handleExport('full-report')}>
                  <Download className="w-4 h-4 mr-2" />
                  Full Report
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Opening custom chart builder...')}
                >
                  <PieChart className="w-4 h-4 mr-2" />
                  Custom Charts
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Opening advanced filters...')}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Opening report scheduler...')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default AdminAnalytics;
