import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Trophy, Target, Heart, Users } from 'lucide-react';

const About = () => {
  const milestones = [
    { year: '2018', title: 'Store Founded', description: 'RECON AUTOBOTS launched to serve the riding community' },
    { year: '2019', title: 'Product Expansion', description: 'Expanded catalog to include all essential riding gear' },
    { year: '2021', title: 'Online Growth', description: 'Launched e-commerce platform for nationwide delivery' },
    { year: '2023', title: 'Customer Milestone', description: 'Served over 10,000 satisfied riders' },
    { year: '2025', title: 'Quality Leader', description: 'Recognized as a trusted source for premium riding gear' },
  ];

  const values = [
    {
      icon: Trophy,
      title: 'Excellence',
      description: 'We pursue perfection in every helmet we create, never compromising on quality or safety'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Constantly pushing the boundaries of helmet technology and design'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Our love for motorcycling drives everything we do'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Supporting riders and the motorcycle community worldwide'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About RECON AUTOBOTS - Your Riding Gear Experts</title>
        <meta
          name="description"
          content="Learn about RECON AUTOBOTS, your trusted source for premium motorcycle riding gear. Discover our commitment to quality, safety, and customer satisfaction."
        />
      </Helmet>

      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-black mb-6">Our Story</h1>
              <p className="text-xl text-primary-foreground/90">
                Passionate about riders, dedicated to quality
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-4xl font-black mb-6">Built on Passion</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                RECON AUTOBOTS was founded with a simple mission: to provide riders with premium quality gear
                at competitive prices. We understand that every ride matters, and proper gear is essential
                for safety, comfort, and enjoyment.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From helmets to boots, jackets to accessories, every product in our store is carefully
                selected to meet the highest standards. We're not just selling gear – we're equipping
                riders for their next adventure.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-secondary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-black mb-4">Our Journey</h2>
              <p className="text-xl text-muted-foreground">
                Key milestones in RECON AUTOBOTS' history
              </p>
            </motion.div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-block px-4 py-2 bg-accent text-accent-foreground font-black text-2xl rounded-lg mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-accent flex-shrink-0" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-black mb-4">Our Values</h2>
              <p className="text-xl text-muted-foreground">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                    <value.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default About;
