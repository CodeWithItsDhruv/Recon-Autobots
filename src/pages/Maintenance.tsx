import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  Clock, 
  Mail, 
  Phone, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Maintenance = () => {
  const features = [
    {
      icon: CheckCircle,
      title: 'Enhanced Performance',
      description: 'We\'re optimizing our servers and database for faster loading times'
    },
    {
      icon: CheckCircle,
      title: 'New Features',
      description: 'Adding exciting new products and improved user experience'
    },
    {
      icon: CheckCircle,
      title: 'Security Updates',
      description: 'Implementing the latest security measures to protect your data'
    }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Support',
      details: 'support@reconautobots.com',
      description: 'We\'ll respond within 2 hours'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      details: '+91 98765 43210',
      description: 'Available 9 AM - 6 PM IST'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Site Maintenance | RECON AUTOBOTS</title>
        <meta
          name="description"
          content="RECON AUTOBOTS is currently undergoing maintenance. We'll be back soon with improved features and better performance."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Maintenance Icon */}
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-orange-500/20 rounded-full mb-6"
              >
                <Wrench className="w-12 h-12 text-orange-400" />
              </motion.div>
            </div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                We're Upgrading!
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                RECON AUTOBOTS is currently undergoing maintenance to bring you an even better experience. 
                We'll be back online shortly.
              </p>
            </motion.div>

            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/20"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-orange-400 font-semibold">Maintenance in Progress</span>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4 text-gray-300">
                <Clock className="w-5 h-5" />
                <span>Estimated completion: 2-3 hours</span>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                >
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Need Immediate Assistance?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((contact, index) => (
                  <div key={contact.title} className="text-center">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <contact.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{contact.title}</h3>
                    <p className="text-blue-400 font-medium mb-1">{contact.details}</p>
                    <p className="text-gray-400 text-sm">{contact.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3"
                onClick={() => window.location.reload()}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Check Again
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-bold px-8 py-3"
                onClick={() => window.open('mailto:support@reconautobots.com')}
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Support
              </Button>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="mt-12 pt-8 border-t border-white/20"
            >
              <p className="text-gray-400 text-sm">
                Thank you for your patience. We're working hard to improve your experience.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                © 2025 RECON AUTOBOTS. All rights reserved.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Maintenance;
