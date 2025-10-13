import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Edit,
  Eye,
  Truck,
  Calendar,
  BarChart3,
  LogOut,
  User,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';

// Mock inventory data
const inventoryData = [
  {
    id: 1,
    name: 'APEX Pro Riding Jacket',
    sku: 'APX-RJ-001',
    category: 'Jackets',
    currentStock: 15,
    minStock: 10,
    maxStock: 50,
    price: '₹12,999',
    cost: '₹8,500',
    supplier: 'APEX Gear Ltd.',
    location: 'Warehouse A-1',
    lastRestocked: '2025-01-10',
    status: 'in_stock',
    image: '/src/assets/product-1.jpg',
    sales30d: 25,
    turnoverRate: 2.5
  },
  {
    id: 2,
    name: 'Carbon Fiber Helmet',
    sku: 'CFH-001',
    category: 'Helmets',
    currentStock: 3,
    minStock: 8,
    maxStock: 30,
    price: '₹18,999',
    cost: '₹12,000',
    supplier: 'Carbon Pro Inc.',
    location: 'Warehouse B-2',
    lastRestocked: '2025-01-05',
    status: 'low_stock',
    image: '/src/assets/product-2.jpg',
    sales30d: 18,
    turnoverRate: 4.2
  },
  {
    id: 3,
    name: 'Racing Boots Pro',
    sku: 'RB-PRO-001',
    category: 'Boots',
    currentStock: 0,
    minStock: 15,
    maxStock: 40,
    price: '₹8,999',
    cost: '₹5,500',
    supplier: 'Speed Gear Co.',
    location: 'Warehouse C-3',
    lastRestocked: '2024-12-28',
    status: 'out_of_stock',
    image: '/src/assets/product-3.jpg',
    sales30d: 0,
    turnoverRate: 0
  },
  {
    id: 4,
    name: 'Leather Riding Gloves',
    sku: 'LRG-001',
    category: 'Gloves',
    currentStock: 45,
    minStock: 20,
    maxStock: 60,
    price: '₹2,999',
    cost: '₹1,800',
    supplier: 'Leather Works Ltd.',
    location: 'Warehouse A-2',
    lastRestocked: '2025-01-12',
    status: 'in_stock',
    image: '/src/assets/product-1.jpg',
    sales30d: 32,
    turnoverRate: 3.1
  },
  {
    id: 5,
    name: 'Premium Knee Guards',
    sku: 'PKG-001',
    category: 'Protection',
    currentStock: 8,
    minStock: 12,
    maxStock: 35,
    price: '₹4,999',
    cost: '₹3,200',
    supplier: 'Safety First Co.',
    location: 'Warehouse B-1',
    lastRestocked: '2025-01-08',
    status: 'low_stock',
    image: '/src/assets/product-2.jpg',
    sales30d: 12,
    turnoverRate: 2.8
  }
];

const AdminInventory = () => {
  const { user, logout } = useAuth();
  const [inventory, setInventory] = useState(inventoryData);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['all', ...Array.from(new Set(inventory.map(item => item.category)))];
  const statuses = ['all', 'in_stock', 'low_stock', 'out_of_stock'];

  // Calculate inventory metrics
  const metrics = useMemo(() => {
    const totalItems = inventory.length;
    const inStock = inventory.filter(item => item.status === 'in_stock').length;
    const lowStock = inventory.filter(item => item.status === 'low_stock').length;
    const outOfStock = inventory.filter(item => item.status === 'out_of_stock').length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * parseInt(item.price.replace(/[₹,]/g, ''))), 0);
    
    return { totalItems, inStock, lowStock, outOfStock, totalValue };
  }, [inventory]);

  // Filtered and sorted inventory
  const filteredInventory = useMemo(() => {
    let filtered = inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'stock':
          aValue = a.currentStock;
          bValue = b.currentStock;
          break;
        case 'price':
          aValue = parseInt(a.price.replace(/[₹,]/g, ''));
          bValue = parseInt(b.price.replace(/[₹,]/g, ''));
          break;
        case 'turnover':
          aValue = a.turnoverRate;
          bValue = b.turnoverRate;
          break;
        case 'lastRestocked':
          aValue = new Date(a.lastRestocked).getTime();
          bValue = new Date(b.lastRestocked).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [inventory, searchQuery, categoryFilter, statusFilter, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock': return <CheckCircle className="w-3 h-3" />;
      case 'low_stock': return <AlertTriangle className="w-3 h-3" />;
      case 'out_of_stock': return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const handleStockUpdate = (id: number, change: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newStock = Math.max(0, item.currentStock + change);
        const newStatus = newStock === 0 ? 'out_of_stock' : 
                         newStock <= item.minStock ? 'low_stock' : 'in_stock';
        
        toast.success(`Stock updated for ${item.name}`);
        return { ...item, currentStock: newStock, status: newStatus };
      }
      return item;
    }));
  };

  const handleBulkAction = (action: string) => {
    if (selectedItems.length === 0) {
      toast.error('Please select items first');
      return;
    }
    
    toast.success(`${action} applied to ${selectedItems.length} items`);
    setSelectedItems([]);
    setShowBulkActions(false);
  };

  const handleExport = () => {
    const csvData = `SKU,Name,Category,Current Stock,Min Stock,Price,Status,Last Restocked\n${
      filteredInventory.map(item => 
        `${item.sku},${item.name},${item.category},${item.currentStock},${item.minStock},${item.price},${item.status},${item.lastRestocked}`
      ).join('\n')
    }`;
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Inventory report exported successfully!');
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success('Inventory data refreshed!');
  };

  return (
    <>
      <Helmet>
        <title>Inventory Management | Admin | RECON AUTOBOTS</title>
        <meta name="description" content="Manage inventory and stock levels in RECON AUTOBOTS admin panel" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
              </div>
              <div className="flex items-center space-x-4">
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
          {/* Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-semibold text-gray-900">{metrics.totalItems}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">In Stock</p>
                  <p className="text-2xl font-semibold text-green-600">{metrics.inStock}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Low Stock</p>
                  <p className="text-2xl font-semibold text-yellow-600">{metrics.lowStock}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-semibold text-red-600">{metrics.outOfStock}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-semibold text-purple-600">
                    ₹{(metrics.totalValue / 100000).toFixed(1)}L
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  
                  <select 
                    className="p-2 border border-gray-300 rounded-md"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat}
                      </option>
                    ))}
                  </select>
                  
                  <select 
                    className="p-2 border border-gray-300 rounded-md"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'all' ? 'All Status' : status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                  
                  <select 
                    className="p-2 border border-gray-300 rounded-md"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="name">Sort by Name</option>
                    <option value="stock">Sort by Stock</option>
                    <option value="price">Sort by Price</option>
                    <option value="turnover">Sort by Turnover</option>
                    <option value="lastRestocked">Sort by Last Restocked</option>
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.csv,.xlsx,.json';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          toast.success(`Importing ${file.name}...`);
                          // In real app, would process the file
                        }
                      };
                      input.click();
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  <Button
                    onClick={() => {
                      toast.info('Redirecting to add product page...');
                      // Navigate to products page with add mode
                      window.location.href = '/admin/products';
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>
              
              {selectedItems.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-blue-700">
                      {selectedItems.length} items selected
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleBulkAction('Bulk Update')}>
                        <Edit className="w-3 h-3 mr-1" />
                        Bulk Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleBulkAction('Bulk Restock')}>
                        <Package className="w-3 h-3 mr-1" />
                        Bulk Restock
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items ({filteredInventory.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInventory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.id]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== item.id));
                          }
                        }}
                        className="rounded"
                      />
                      
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-2">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.sku} • {item.category}</p>
                          <p className="text-xs text-gray-500">{item.supplier}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Stock Level</p>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{item.currentStock}</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  item.currentStock <= item.minStock ? 'bg-red-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">Min: {item.minStock} | Max: {item.maxStock}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <Badge className={`${getStatusColor(item.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(item.status)}
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Price</p>
                          <p className="font-semibold">{item.price}</p>
                          <p className="text-xs text-gray-500">Cost: {item.cost}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600">Performance</p>
                          <p className="text-sm">Sales: {item.sales30d}/30d</p>
                          <p className="text-xs text-gray-500">Turnover: {item.turnoverRate}x</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStockUpdate(item.id, -1)}
                            disabled={item.currentStock === 0}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStockUpdate(item.id, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {filteredInventory.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600">
                    {searchQuery ? 'Try adjusting your search or filters' : 'Start by adding your first product'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default AdminInventory;
