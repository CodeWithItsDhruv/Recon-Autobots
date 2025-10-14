import { motion } from 'framer-motion';

const ReadyToRideCTA = () => {
  return (
    <section className="py-24 bg-secondary text-secondary-foreground">
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
          <p className="text-xl mb-8 text-secondary-foreground/90">
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
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-secondary-foreground hover:bg-secondary-foreground/10 text-secondary-foreground font-bold rounded-full transition-colors"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReadyToRideCTA;
