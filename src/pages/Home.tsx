import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import productsData from '@/data/products.json';
import heroOffroad from '@/assets/hero-offroad.jpg';
import heroHelmet from '@/assets/hero-helmet-1.jpg';
import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';
import brandAiroh from '@/assets/brands/1200x628Artboard_1.webp';
import brandAxor from '@/assets/brands/AXOR_NEW_LOGO.webp';
import brandBMC from '@/assets/brands/bmc-air-filters-logo-BE292C09A8-seeklogo.com__1_0.png';
import brandBluArmor from '@/assets/brands/Logo-BluArmor_200x100_c413d7a3-ad00-4199-9525-aab544aea79c_200x46.png';
import brandMaddog from '@/assets/brands/maddog-linear-red-black-logo.png';
import brandSMK from '@/assets/brands/SMK-LOGO-1.png';
import brandStudds from '@/assets/brands/STUDDS_LOGO_WEBSITE2-1.webp';

const Home = () => {
  // Map product images
  const productImages: { [key: string]: string } = {
    'apex-riding-jacket': product1,
    'trail-blazer-helmet': product2,
    'carbon-pro-gloves': product3,
  };

  const featuredProducts = productsData.slice(0, 3);

  const categories = [
    {
      title: 'RIDING JACKETS',
      description: 'Premium leather and textile jackets with CE-approved armor. Maximum protection meets modern style.',
      image: heroHelmet,
      link: '/products?category=jackets'
    },
    {
      title: 'HELMETS & SAFETY',
      description: 'DOT and ISI certified helmets for every riding style. Your safety is our priority.',
      image: heroOffroad,
      link: '/products?category=helmets'
    }
  ];


  return (
    <>
      <Helmet>
        <title>RECON AUTOBOTS - Premium Motorcycle Riding Gear & Accessories</title>
        <meta
          name="description"
          content="Shop premium motorcycle riding gear at RECON AUTOBOTS. Quality jackets, helmets, gloves, boots, luggage, and accessories for every rider. Free shipping available."
        />
        <meta property="og:title" content="RECON AUTOBOTS - Motorcycle Riding Gear Store" />
        <meta property="og:description" content="Your one-stop shop for premium motorcycle riding gear and accessories" />
      </Helmet>

      <Navbar />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Scrolling Text Section */}
        <section className="py-8 bg-white border-t border-b border-black/15">
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll whitespace-nowrap">
              <div className="flex items-center space-x-16 px-8">
                <span className="text-2xl md:text-4xl font-black text-black tracking-wider">
                  THE ULTIMATE DESTINATION FOR MOTORCYCLE GEAR, ACCESSORIES AND PARTS
                </span>
                <span className="text-2xl md:text-4xl font-black text-black tracking-wider">
                  THE ULTIMATE DESTINATION FOR MOTORCYCLE GEAR, ACCESSORIES AND PARTS
                </span>
                <span className="text-2xl md:text-4xl font-black text-black tracking-wider">
                  THE ULTIMATE DESTINATION FOR MOTORCYCLE GEAR, ACCESSORIES AND PARTS
                </span>
                <span className="text-2xl md:text-4xl font-black text-black tracking-wider">
                  THE ULTIMATE DESTINATION FOR MOTORCYCLE GEAR, ACCESSORIES AND PARTS
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Category Sections */}
        {categories.map((category, index) => (
          <CategorySection
            key={category.title}
            {...category}
            index={index}
          />
        ))}

        {/* Brand Marquee Section */}
        <section className="bg-secondary overflow-hidden border-t border-b border-black/15">
          <div className="relative overflow-hidden py-8">
            <div className="flex animate-scroll-brands whitespace-nowrap">
              <div className="flex items-center space-x-16 px-8">
                <span className="text-2xl md:text-3xl font-black text-foreground tracking-wider">
                  AIROH • AXOR • BMC • BLUARMOR • MADDOG • SMK • STUDDS
                </span>
                <span className="text-2xl md:text-3xl font-black text-foreground tracking-wider">
                  AIROH • AXOR • BMC • BLUARMOR • MADDOG • SMK • STUDDS
                </span>
                <span className="text-2xl md:text-3xl font-black text-foreground tracking-wider">
                  AIROH • AXOR • BMC • BLUARMOR • MADDOG • SMK • STUDDS
                </span>
                <span className="text-2xl md:text-3xl font-black text-foreground tracking-wider">
                  AIROH • AXOR • BMC • BLUARMOR • MADDOG • SMK • STUDDS
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-black mb-4">Featured Products</h2>
              <p className="text-xl text-muted-foreground">
                Explore our best-selling riding gear
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={productImages[product.id] || product1}
                  price={product.price}
                  category={product.category}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Ready to Ride?
              </h2>
              <p className="text-xl mb-8 text-primary-foreground/90">
                Shop our complete collection or find a store near you
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-full transition-colors"
                >
                  Shop Now
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-primary-foreground hover:bg-primary-foreground/10 text-primary-foreground font-bold rounded-full transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
