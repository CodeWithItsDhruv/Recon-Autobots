import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CategorySectionProps {
  title: string;
  description: string;
  image: string;
  link: string;
  index: number;
}

const CategorySection = ({ title, description, image, link, index }: CategorySectionProps) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${isEven ? '' : 'lg:grid-flow-dense'}`}
    >
      {/* Image Side */}
      <div className={`relative h-96 lg:h-[600px] overflow-hidden ${isEven ? '' : 'lg:col-start-2'}`}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Content Side */}
      <div className={`flex items-center justify-center p-8 lg:p-16 bg-secondary ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
        <div className="max-w-lg">
          <motion.h2
            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl lg:text-5xl font-black mb-6 text-foreground"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-muted-foreground mb-8"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              to={link}
              className="inline-flex items-center space-x-2 text-accent hover:text-accent/80 font-bold text-lg group"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CategorySection;
