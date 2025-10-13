import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCart } from '@/contexts/CartContext';
import productsData from '@/data/products.json';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: string;
  category: string;
}

const ProductCard = ({ id, name, image, price, category }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  
  // Helper function to parse price string to number
  const parsePrice = (priceString: string): number => {
    return parseInt(priceString.replace(/[^0-9]/g, ''));
  };
  
  // Get product details including sizes
  const product = productsData.find(p => p.id === id);
  const sizes = product?.sizes || [];
  
  const handleQuickAdd = () => {
    if (sizes.length > 0) {
      setShowSizeModal(true);
    } else {
      // If no sizes, add directly
      addToCart({
        id,
        name,
        price: parsePrice(price),
        image,
        category
      });
    }
  };
  
  const handleAddWithSize = () => {
    if (selectedSize) {
      addToCart({
        id,
        name,
        price: parsePrice(price),
        image,
        size: selectedSize,
        category
      });
      setShowSizeModal(false);
      setSelectedSize('');
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-lg overflow-hidden shadow-lg border border-border"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full uppercase">
            {category}
          </span>
        </div>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <Link to={`/product/${id}`}>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
          <Button
            size="sm"
            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full"
            onClick={(e) => {
              e.preventDefault();
              handleQuickAdd();
            }}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 bg-primary">
        <h3 className="font-bold text-lg mb-2 text-primary-foreground group-hover:text-accent transition-colors">
          {name}
        </h3>
        <p className="text-2xl font-black text-accent">{price}</p>
      </div>
      
      {/* Quick Add Size Modal */}
      <Dialog open={showSizeModal} onOpenChange={setShowSizeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Select Size</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={image} 
                alt={name} 
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <div>
                <h4 className="font-bold text-sm">{name}</h4>
                <p className="text-lg font-black text-accent">{price}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-3">Choose your size:</p>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 border-2 rounded-lg font-semibold transition-all ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowSizeModal(false);
                  setSelectedSize('');
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-black hover:bg-gray-800 text-white"
                disabled={!selectedSize}
                onClick={handleAddWithSize}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProductCard;
