import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-wider">RECON AUTOBOTS</h2>
            <p className="text-sm text-primary-foreground/80">
              Your one-stop shop for premium motorcycle riding gear and accessories.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-bold text-lg mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products?category=jackets" className="hover:text-accent transition-colors">
                  Riding Jackets
                </Link>
              </li>
              <li>
                <Link to="/products?category=helmets" className="hover:text-accent transition-colors">
                  Helmets
                </Link>
              </li>
              <li>
                <Link to="/products?category=gloves" className="hover:text-accent transition-colors">
                  Gloves
                </Link>
              </li>
              <li>
                <Link to="/products?category=boots" className="hover:text-accent transition-colors">
                  Boots
                </Link>
              </li>
              <li>
                <Link to="/products?category=luggage" className="hover:text-accent transition-colors">
                  Luggage
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-accent transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-accent transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-accent transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4">Stay Updated</h3>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Subscribe to our newsletter for latest gear and exclusive offers.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded bg-primary-foreground/10 border border-primary-foreground/20 focus:border-accent focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="w-full bg-accent text-accent-foreground font-semibold py-2 rounded hover:bg-accent/90 transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-primary-foreground/60">
            <p>© 2025 RECON AUTOBOTS. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
