import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Shield, Eye, Lock, Database, Mail, Phone } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: [
        'Personal information you provide when creating an account, placing orders, or contacting us',
        'Payment and billing information processed securely through our payment partners',
        'Device and usage information to improve our website and services',
        'Communication preferences and marketing consent information'
      ]
    },
    {
      icon: Database,
      title: 'How We Use Your Information',
      content: [
        'Process and fulfill your orders and provide customer support',
        'Send order confirmations, shipping updates, and important account information',
        'Improve our products, services, and website functionality',
        'Send marketing communications (only with your consent)',
        'Comply with legal obligations and protect against fraud'
      ]
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        'We use industry-standard encryption to protect your personal information',
        'All payment data is processed through PCI-compliant payment processors',
        'Access to your data is restricted to authorized personnel only',
        'We regularly update our security measures to protect against threats',
        'Your data is stored on secure servers with appropriate access controls'
      ]
    },
    {
      icon: Shield,
      title: 'Your Rights',
      content: [
        'Access and update your personal information at any time',
        'Request deletion of your account and associated data',
        'Opt-out of marketing communications',
        'Request a copy of your personal data',
        'Withdraw consent for data processing where applicable'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy - RECON AUTOBOTS</title>
        <meta
          name="description"
          content="Learn how RECON AUTOBOTS protects your privacy and handles your personal information. Our commitment to data security and your privacy rights."
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
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-6">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-4">Privacy Policy</h1>
              <p className="text-xl text-primary-foreground/90">
                Your privacy is important to us
              </p>
              <p className="text-sm text-primary-foreground/70 mt-4">
                Last updated: January 2025
              </p>
            </motion.div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none"
            >
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                At RECON AUTOBOTS, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                By using our services, you agree to the collection and use of information in accordance with this policy. 
                We will not use or share your information with anyone except as described in this Privacy Policy.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Policy Sections */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card rounded-lg p-8 border border-border"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4">
                      <section.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="text-2xl font-black">{section.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-accent mt-2 mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="py-16 bg-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="text-3xl font-black mb-6">Additional Information</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3">Cookies and Tracking</h3>
                  <p className="text-muted-foreground">
                    We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, 
                    and personalize content. You can control cookie settings through your browser preferences.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">Third-Party Services</h3>
                  <p className="text-muted-foreground">
                    We may use third-party services for payment processing, analytics, and marketing. 
                    These services have their own privacy policies and we encourage you to review them.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">Data Retention</h3>
                  <p className="text-muted-foreground">
                    We retain your personal information for as long as necessary to provide our services 
                    and comply with legal obligations. You may request deletion of your data at any time.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">Policy Updates</h3>
                  <p className="text-muted-foreground">
                    We may update this Privacy Policy from time to time. We will notify you of any changes 
                    by posting the new policy on this page and updating the "Last updated" date.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-black mb-6">Questions About This Policy?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                If you have any questions about this Privacy Policy, please contact us
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:privacy@reconautobots.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-lg transition-colors"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  privacy@reconautobots.com
                </a>
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center justify-center px-6 py-3 bg-transparent border-2 border-accent hover:bg-accent/10 text-accent font-bold rounded-lg transition-colors"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  +91 98765 43210
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

export default PrivacyPolicy;
