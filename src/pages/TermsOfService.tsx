import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, Scale, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const TermsOfService = () => {
  const sections = [
    {
      icon: CheckCircle,
      title: 'Acceptance of Terms',
      content: [
        'By accessing and using RECON AUTOBOTS website and services, you accept and agree to be bound by these Terms of Service',
        'If you do not agree to these terms, please do not use our services',
        'We reserve the right to modify these terms at any time without prior notice',
        'Your continued use of our services after changes constitutes acceptance of the new terms'
      ]
    },
    {
      icon: Shield,
      title: 'Product Information',
      content: [
        'All product descriptions, images, and specifications are provided for informational purposes',
        'We strive for accuracy but cannot guarantee that all information is error-free',
        'Product availability is subject to stock levels and may change without notice',
        'Prices are subject to change and are valid only at the time of purchase'
      ]
    },
    {
      icon: Scale,
      title: 'Orders and Payment',
      content: [
        'All orders are subject to acceptance and availability',
        'We reserve the right to refuse or cancel any order at our discretion',
        'Payment must be received before order processing begins',
        'We accept all major credit cards, UPI, and digital payment methods',
        'Orders may be subject to verification and fraud prevention measures'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Returns and Refunds',
      content: [
        'Returns must be initiated within 30 days of delivery',
        'Items must be in original condition with tags and packaging',
        'Custom or personalized items cannot be returned',
        'Return shipping costs are the responsibility of the customer',
        'Refunds will be processed within 5-7 business days after return receipt'
      ]
    },
    {
      icon: FileText,
      title: 'Intellectual Property',
      content: [
        'All content on this website is owned by RECON AUTOBOTS or our licensors',
        'You may not reproduce, distribute, or modify any content without permission',
        'Trademarks and logos are protected by intellectual property laws',
        'Unauthorized use of our intellectual property is strictly prohibited'
      ]
    },
    {
      icon: XCircle,
      title: 'Limitation of Liability',
      content: [
        'RECON AUTOBOTS shall not be liable for any indirect, incidental, or consequential damages',
        'Our liability is limited to the amount paid for the specific product or service',
        'We are not responsible for damages resulting from misuse of products',
        'Some jurisdictions may not allow limitation of liability, so these limitations may not apply to you'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Terms of Service - RECON AUTOBOTS</title>
        <meta
          name="description"
          content="Read RECON AUTOBOTS Terms of Service to understand your rights and responsibilities when using our website and purchasing motorcycle riding gear."
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
                <FileText className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-4">Terms of Service</h1>
              <p className="text-xl text-primary-foreground/90">
                Please read these terms carefully before using our services
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
                Welcome to RECON AUTOBOTS! These Terms of Service ("Terms") govern your use of our website, 
                products, and services. By accessing or using our services, you agree to be bound by these Terms.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We reserve the right to update these Terms at any time. We will notify users of any material changes 
                by posting the new Terms on this page and updating the "Last updated" date.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Terms Sections */}
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

        {/* Additional Terms */}
        <section className="py-16 bg-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="text-3xl font-black mb-6">Additional Terms</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3">Governing Law</h3>
                  <p className="text-muted-foreground">
                    These Terms shall be governed by and construed in accordance with the laws of India. 
                    Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">Severability</h3>
                  <p className="text-muted-foreground">
                    If any provision of these Terms is found to be unenforceable or invalid, 
                    that provision will be limited or eliminated to the minimum extent necessary 
                    so that these Terms will otherwise remain in full force and effect.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">Entire Agreement</h3>
                  <p className="text-muted-foreground">
                    These Terms constitute the entire agreement between you and RECON AUTOBOTS 
                    regarding the use of our services and supersede all prior agreements and understandings.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">Contact Information</h3>
                  <p className="text-muted-foreground">
                    If you have any questions about these Terms of Service, please contact us at:
                    <br />
                    Email: legal@reconautobots.com
                    <br />
                    Phone: +91 98765 43210
                    <br />
                    Address: 123 Rider Street, Mumbai, Maharashtra 400001, India
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default TermsOfService;
