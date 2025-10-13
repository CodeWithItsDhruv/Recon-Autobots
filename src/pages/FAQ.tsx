import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Shield, Truck, CreditCard, RotateCcw, Headphones } from 'lucide-react';

const FAQ = () => {
  const faqCategories = [
    {
      icon: Shield,
      title: 'Product & Safety',
      questions: [
        {
          question: 'Are your helmets DOT and ISI certified?',
          answer: 'Yes, all our helmets meet or exceed DOT and ISI safety standards. Each helmet comes with certification labels and detailed safety information.'
        },
        {
          question: 'What materials are used in your riding jackets?',
          answer: 'Our jackets use premium materials including genuine leather, Cordura fabric, and breathable mesh panels. All jackets include CE-approved armor for maximum protection.'
        },
        {
          question: 'How do I choose the right helmet size?',
          answer: 'Measure your head circumference just above your eyebrows. Use our size guide on each product page, or visit our store for professional fitting assistance.'
        },
        {
          question: 'Do you offer warranty on your products?',
          answer: 'Yes, all products come with a 2-year manufacturer warranty covering defects in materials and workmanship. Some premium items have extended warranty options.'
        }
      ]
    },
    {
      icon: Truck,
      title: 'Shipping & Delivery',
      questions: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping takes 3-5 business days within India. Express shipping (1-2 days) is available for major cities. International shipping varies by location.'
        },
        {
          question: 'Do you offer free shipping?',
          answer: 'Yes! Free shipping is available on orders over ₹5,000 within India. Express shipping charges may apply for faster delivery.'
        },
        {
          question: 'Can I track my order?',
          answer: 'Absolutely! You\'ll receive a tracking number via email once your order ships. Track your package in real-time through our website or carrier\'s app.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. Contact us for specific rates.'
        }
      ]
    },
    {
      icon: CreditCard,
      title: 'Orders & Payments',
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets. EMI options are available for orders over ₹3,000.'
        },
        {
          question: 'Can I modify or cancel my order?',
          answer: 'You can modify or cancel your order within 2 hours of placement. After that, orders are processed and cannot be changed. Contact us immediately if needed.'
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, we use industry-standard SSL encryption and PCI-compliant payment processors. Your payment information is never stored on our servers.'
        },
        {
          question: 'Do you offer bulk discounts?',
          answer: 'Yes, we offer special pricing for bulk orders and dealer partnerships. Contact our sales team for custom quotes and volume discounts.'
        }
      ]
    },
    {
      icon: RotateCcw,
      title: 'Returns & Exchanges',
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for unused items in original packaging. Items must be in resellable condition with tags attached.'
        },
        {
          question: 'How do I return an item?',
          answer: 'Initiate a return through your account dashboard or contact customer service. We\'ll provide a prepaid return label for your convenience.'
        },
        {
          question: 'Are there any items that cannot be returned?',
          answer: 'Custom-sized items, personalized products, and items damaged by misuse cannot be returned. Safety gear must be unused for hygiene reasons.'
        },
        {
          question: 'How long do refunds take?',
          answer: 'Refunds are processed within 5-7 business days after we receive your return. The refund will appear on your original payment method.'
        }
      ]
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      questions: [
        {
          question: 'How can I contact customer support?',
          answer: 'Reach us via phone (+91 98765 43210), email (support@reconautobots.com), or live chat. We\'re available Monday-Saturday, 9 AM - 6 PM IST.'
        },
        {
          question: 'Do you have a physical store?',
          answer: 'Yes, our flagship store is located at 123 Rider Street, Mumbai. We also have authorized dealers across major cities in India.'
        },
        {
          question: 'Can I get product recommendations?',
          answer: 'Absolutely! Our expert team can help you choose the right gear based on your riding style, budget, and requirements. Contact us for personalized advice.'
        },
        {
          question: 'Do you offer installation services?',
          answer: 'Yes, we provide installation services for accessories like fog lights, luggage systems, and other add-ons. Service charges may apply.'
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>FAQ - Frequently Asked Questions | RECON AUTOBOTS</title>
        <meta
          name="description"
          content="Find answers to common questions about RECON AUTOBOTS products, shipping, returns, and customer support. Get help with your motorcycle riding gear needs."
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
                <HelpCircle className="w-8 h-8 text-accent" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-4">Frequently Asked Questions</h1>
              <p className="text-xl text-primary-foreground/90">
                Find answers to common questions about our products and services
              </p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="mb-12"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4">
                    <category.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-2xl font-black">{category.title}</h2>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`} className="border border-border rounded-lg px-6">
                      <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-6">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-black mb-4">Still Have Questions?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Our customer support team is here to help you find the perfect riding gear
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-full transition-colors"
                >
                  Contact Support
                </a>
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-accent hover:bg-accent/10 text-accent font-bold rounded-full transition-colors"
                >
                  Call Us Now
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

export default FAQ;
