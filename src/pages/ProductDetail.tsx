import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import productsData from '@/data/products.json';
import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';
import { ShoppingCart, Shield, Package, Truck } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  // Helper function to parse price string to number
  const parsePrice = (priceString: string): number => {
    return parseInt(priceString.replace(/[^0-9]/g, ''));
  };
  
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

  const product = productsData.find(p => p.id === id);
  
  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    
    const productImage = productImages[product.id] || product1;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: parsePrice(product.price),
      image: productImage,
      size: selectedSize,
      category: product.category
    }, quantity);
  };

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-4xl font-black mb-4">Product Not Found</h1>
            <a href="/products" className="text-accent hover:underline">
              Back to Products
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const productImage = productImages[product.id] || product1;

  return (
    <>
      <Helmet>
        <title>{product.name} - Premium Riding Gear | RECON AUTOBOTS</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <Navbar />

      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-bold rounded-full mb-4">
                  {product.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-black mb-4">{product.name}</h1>
                <p className="text-3xl font-black text-accent mb-6">{product.price}</p>
                <p className="text-lg text-muted-foreground">{product.description}</p>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="font-bold mb-3">Select Size {!selectedSize && <span className="text-red-500 text-sm">*</span>}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 border-2 rounded-lg font-semibold transition-all ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-sm text-gray-500 mt-2">Please select a size to continue</p>
                )}
              </div>
              
              {/* Quantity Selection */}
              <div>
                <h3 className="font-bold mb-3">Quantity</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-black transition-colors font-semibold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-black transition-colors font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-bold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Shield className="w-5 h-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-6">
                <Button
                  size="lg"
                  className="w-full bg-black hover:bg-gray-800 text-white font-bold text-lg h-14 shadow-lg"
                  disabled={!selectedSize}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Info Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <Package className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-muted-foreground">Free Shipping</p>
                </div>
                <div className="text-center">
                  <Truck className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-muted-foreground">Fast Delivery</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-muted-foreground">2 Year Warranty</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16"
          >
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent">
                  Description
                </TabsTrigger>
                <TabsTrigger value="technology" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent">
                  Technology
                </TabsTrigger>
                <TabsTrigger value="sizing" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent">
                  Size Guide
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="py-8">
                <div className="prose max-w-none">
                  <p className="text-lg">{product.description}</p>
                <p className="mt-4 text-muted-foreground">
                    The {product.name} represents premium quality and exceptional value. Designed with rider safety
                    and comfort in mind, this product combines advanced materials with practical features
                    to enhance your riding experience.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="technology" className="py-8">
                <div className="space-y-6">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                      <div>
                        <h4 className="font-bold mb-1">{feature}</h4>
                        <p className="text-muted-foreground">
                          Advanced technology designed to enhance your riding experience.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="sizing" className="py-8">
                <div className="overflow-x-auto">
                  <table className="w-full border border-border">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="px-4 py-3 text-left font-bold">Size</th>
                        <th className="px-4 py-3 text-left font-bold">Head Circumference (cm)</th>
                        <th className="px-4 py-3 text-left font-bold">Head Circumference (inches)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-4 py-3">XS</td>
                        <td className="px-4 py-3">53-54 cm</td>
                        <td className="px-4 py-3">20.9-21.3"</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-3">S</td>
                        <td className="px-4 py-3">55-56 cm</td>
                        <td className="px-4 py-3">21.7-22.0"</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-3">M</td>
                        <td className="px-4 py-3">57-58 cm</td>
                        <td className="px-4 py-3">22.4-22.8"</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-3">L</td>
                        <td className="px-4 py-3">59-60 cm</td>
                        <td className="px-4 py-3">23.2-23.6"</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-3">XL</td>
                        <td className="px-4 py-3">61-62 cm</td>
                        <td className="px-4 py-3">24.0-24.4"</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-3">XXL</td>
                        <td className="px-4 py-3">63-64 cm</td>
                        <td className="px-4 py-3">24.8-25.2"</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProductDetail;
