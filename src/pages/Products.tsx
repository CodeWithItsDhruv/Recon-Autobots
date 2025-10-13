import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import productsData from '@/data/products.json';
import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';
import { Filter, Search, SortAsc, SortDesc, X } from 'lucide-react';

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  // Removed searchQuery state - using Navbar search instead
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [showFilters, setShowFilters] = useState(false);

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

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'jackets', name: 'Riding Jackets', match: 'Jackets' },
    { id: 'helmets', name: 'Helmets', match: 'Helmets' },
    { id: 'gloves', name: 'Gloves', match: 'Gloves' },
    { id: 'boots', name: 'Boots', match: 'Boots' },
    { id: 'pants', name: 'Riding Pants', match: 'Pants' },
    { id: 'luggage', name: 'Luggage', match: 'Luggage' },
    { id: 'fog-lights', name: 'Fog Lights', match: 'Fog Lights' },
    { id: 'protection', name: 'Protective Gear', match: 'Protection' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'category', label: 'Category' },
  ];

  // Helper function to extract numeric price from string
  const extractPrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/[₹,]/g, ''));
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = productsData;

    // Filter by category
    if (selectedCategory !== 'all') {
      const category = categories.find(c => c.id === selectedCategory);
      filtered = filtered.filter(product => product.category === category?.match);
    }

    // Search filtering handled by Navbar search

    // Filter by price range
    filtered = filtered.filter(product => {
      const price = extractPrice(product.price);
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'price':
          aValue = extractPrice(a.price);
          bValue = extractPrice(b.price);
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [selectedCategory, priceRange, sortBy, sortOrder]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 50000 });
    setSortBy('name');
    setSortOrder('asc');
  };

  const hasActiveFilters = selectedCategory !== 'all' || priceRange.min > 0 || priceRange.max < 50000;

  return (
    <>
      <Helmet>
        <title>Shop Motorcycle Riding Gear | RECON AUTOBOTS</title>
        <meta
          name="description"
          content="Browse RECON AUTOBOTS' complete collection of motorcycle riding gear. Jackets, helmets, gloves, boots, luggage, and accessories. Premium quality with fast shipping."
        />
      </Helmet>

      <Navbar />

      <main className="pt-20">
        {/* Header */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-black mb-4">Our Products</h1>
              <p className="text-xl text-primary-foreground/90">
                Premium riding gear for every journey
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters & Products */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter Bar */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search Note */}
                <div className="flex-1 max-w-md">
                  <p className="text-sm text-gray-600">
                    💡 Use the search icon in the navigation bar above to search products
                  </p>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </button>
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="bg-white text-accent text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-border"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Filter */}
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Category</h3>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                              selectedCategory === category.id
                                ? 'bg-accent text-accent-foreground'
                                : 'bg-secondary text-secondary-foreground hover:bg-accent/10'
                            }`}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range Filter */}
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Price Range</h3>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 50000 }))}
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Range: ₹{priceRange.min.toLocaleString()} - ₹{priceRange.max.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Clear all filters
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {filteredAndSortedProducts.length} of {productsData.length} products
              </p>
              {hasActiveFilters && (
                <div className="text-sm text-accent">
                  Filters applied
                </div>
              )}
            </div>

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={productImages[product.id] || product1}
                  price={product.price}
                  category={product.category}
                />
              ))}
            </motion.div>

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Products;
