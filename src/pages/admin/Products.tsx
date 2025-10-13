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
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  Filter,
  SortAsc,
  SortDesc,
  LogOut,
  User,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import productsData from '@/data/products.json';

// Enhanced product interface
interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  image: string;
  description: string;
  stock: number;
  sku: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  featured: boolean;
  tags: string[];
  specifications?: Record<string, string>;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock enhanced products data
const mockProducts: Product[] = productsData.map((product, index) => ({
  ...product,
  stock: Math.floor(Math.random() * 100) + 1,
  sku: `SKU-${String(product.id).padStart(3, '0')}`,
  status: Math.random() > 0.1 ? 'active' : (Math.random() > 0.5 ? 'inactive' : 'out_of_stock'),
  featured: Math.random() > 0.7,
  tags: ['premium', 'bestseller', 'new'].filter(() => Math.random() > 0.6),
  specifications: {
    'Material': ['Leather', 'Carbon Fiber', 'Textile', 'Synthetic'][Math.floor(Math.random() * 4)],
    'Size': 'Multiple sizes available',
    'Color': ['Black', 'White', 'Red', 'Blue'][Math.floor(Math.random() * 4)],
    'Weight': `${Math.floor(Math.random() * 2000) + 500}g`
  },
  images: [product.image, product.image, product.image],
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString()
})) as Product[];

const AdminProducts = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const statuses = ['all', 'active', 'inactive', 'out_of_stock'];

  // Filtering and sorting logic
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = parseInt(a.price.replace(/[₹,]/g, ''));
          bValue = parseInt(b.price.replace(/[₹,]/g, ''));
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
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
  }, [products, searchQuery, selectedCategory, statusFilter, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-3 h-3" />;
      case 'inactive': return <AlertCircle className="w-3 h-3" />;
      case 'out_of_stock': return <X className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleUpdateStock = (productId: number, newStock: number) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, stock: newStock, status: newStock === 0 ? 'out_of_stock' : p.status }
        : p
    ));
  };

  const handleToggleStatus = (productId: number) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ));
  };

  const handleToggleFeatured = (productId: number) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, featured: !p.featured }
        : p
    ));
  };

  const ProductForm = ({ product, onSave, onCancel }: { 
    product?: Product | null, 
    onSave: (product: Product) => void, 
    onCancel: () => void 
  }) => {
    const [formData, setFormData] = useState<Partial<Product>>(
      product || {
        name: '',
        category: '',
        price: '',
        description: '',
        stock: 0,
        sku: '',
        status: 'active',
        featured: false,
        tags: [],
        image: ''
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newProduct: Product = {
        ...formData,
        id: product?.id || Date.now(),
        createdAt: product?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        images: formData.images || [formData.image || ''],
        specifications: formData.specifications || {}
      } as Product;
      
      onSave(newProduct);
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <Input
                value={formData.sku || ''}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.category || ''}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <Input
                value={formData.price || ''}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <Input
                type="number"
                value={formData.stock || 0}
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={formData.status || 'active'}
                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <Input
                value={formData.image || ''}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="md:col-span-2 flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="mr-2"
                />
                Featured Product
              </label>
            </div>

            <div className="md:col-span-2 flex items-center space-x-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                {product ? 'Update Product' : 'Add Product'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <Helmet>
        <title>Product Management | Admin | RECON AUTOBOTS</title>
        <meta name="description" content="Manage products in RECON AUTOBOTS admin panel" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{user?.username}</span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowAddProduct(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
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
                      toast.success(`Importing products from ${file.name}...`);
                      // In real app, would process the file and update products
                    }
                  };
                  input.click();
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  const csvData = `SKU,Name,Category,Price,Stock,Status\n${filteredAndSortedProducts.map(product => 
                    `${product.sku},"${product.name}",${product.category},${product.price},${product.stock},${product.status}`
                  ).join('\n')}`;
                  
                  const blob = new Blob([csvData], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                  toast.success('Products exported successfully!');
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button 
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat === 'all' ? 'All Categories' : cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status === 'all' ? 'All Status' : status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Name</option>
                      <option value="price">Price</option>
                      <option value="stock">Stock</option>
                      <option value="category">Category</option>
                      <option value="status">Status</option>
                      <option value="createdAt">Date Created</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                    <Button
                      variant="outline"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="w-full justify-center"
                    >
                      {sortOrder === 'asc' ? <SortAsc className="w-4 h-4 mr-2" /> : <SortDesc className="w-4 h-4 mr-2" />}
                      {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Add/Edit Product Form */}
          {(showAddProduct || editingProduct) && (
            <ProductForm
              product={editingProduct}
              onSave={(product) => {
                if (editingProduct) {
                  setProducts(products.map(p => p.id === product.id ? product : p));
                } else {
                  setProducts([...products, product]);
                }
                setShowAddProduct(false);
                setEditingProduct(null);
              }}
              onCancel={() => {
                setShowAddProduct(false);
                setEditingProduct(null);
              }}
            />
          )}

          {/* Products Summary */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {filteredAndSortedProducts.length} of {products.length} products
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {product.featured && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                          Featured
                        </Badge>
                      )}
                      <Badge className={`absolute top-2 right-2 ${getStatusColor(product.status)} flex items-center gap-1`}>
                        {getStatusIcon(product.status)}
                        {product.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">SKU: {product.sku}</p>
                      <p className="text-sm text-gray-600 mb-2">Category: {product.category}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-gray-900">{product.price}</span>
                        <span className={`text-sm ${product.stock <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                          Stock: {product.stock}
                        </span>
                      </div>

                      {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(product.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleFeatured(product.id)}
                          >
                            {product.featured ? 'Unfeature' : 'Feature'}
                          </Button>
                        </div>
                      </div>
                      
                      {/* Quick Stock Update */}
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600">Quick stock update:</span>
                          <Input
                            type="number"
                            value={product.stock}
                            onChange={(e) => handleUpdateStock(product.id, parseInt(e.target.value) || 0)}
                            className="w-20 h-8 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try adjusting your search or filters' : 'Start by adding your first product'}
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminProducts;