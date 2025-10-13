import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | RECON AUTOBOTS</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist. Return to RECON AUTOBOTS homepage to continue shopping for premium motorcycle riding gear."
        />
      </Helmet>

      <Navbar />

      <main className="pt-20 min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* 404 Illustration */}
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-8xl md:text-9xl font-black text-accent mb-4"
              >
                404
              </motion.div>
              <div className="text-6xl mb-6">🏍️</div>
            </div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className="text-4xl md:text-5xl font-black mb-6">Page Not Found</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Looks like you've taken a wrong turn! The page you're looking for doesn't exist or has been moved.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                <Link to="/">
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="font-semibold">
                <Link to="/products">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Products
                </Link>
              </Button>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-16 pt-8 border-t border-border"
            >
              <h3 className="text-lg font-bold mb-6">Popular Pages</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <Link
                  to="/products?category=helmets"
                  className="p-4 rounded-lg bg-secondary hover:bg-accent/10 transition-colors group"
                >
                  <div className="text-2xl mb-2">🪖</div>
                  <div className="font-semibold group-hover:text-accent">Helmets</div>
                </Link>
                
                <Link
                  to="/products?category=jackets"
                  className="p-4 rounded-lg bg-secondary hover:bg-accent/10 transition-colors group"
                >
                  <div className="text-2xl mb-2">🧥</div>
                  <div className="font-semibold group-hover:text-accent">Jackets</div>
                </Link>
                
                <Link
                  to="/contact"
                  className="p-4 rounded-lg bg-secondary hover:bg-accent/10 transition-colors group"
                >
                  <div className="text-2xl mb-2">📞</div>
                  <div className="font-semibold group-hover:text-accent">Contact</div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default NotFound;
