import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon,
  User,
  Store,
  CreditCard,
  Truck,
  Bell,
  Shield,
  Database,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  RefreshCw,
  Upload,
  Download,
  Eye,
  EyeOff,
  LogOut,
  CheckCircle,
  AlertCircle,
  Lock,
  Key,
  Palette,
  Monitor,
  Smartphone,
  Zap,
  BarChart3,
  FileText,
  Clock,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';

const AdminSettings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'RECON AUTOBOTS',
    siteDescription: 'Premium motorcycle riding gear and accessories',
    siteUrl: 'https://reconautobots.com',
    contactEmail: 'support@reconautobots.com',
    contactPhone: '+91 98765 43210',
    address: '123 Business Park, Gurgaon, Haryana 122001',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    language: 'English'
  });

  const [paymentSettings, setPaymentSettings] = useState({
    razorpayEnabled: true,
    paypalEnabled: false,
    stripeEnabled: false,
    codEnabled: true,
    bankTransferEnabled: true,
    taxRate: '18',
    shippingFee: '150'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderNotifications: true,
    stockAlerts: true,
    customerUpdates: true,
    marketingEmails: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordPolicy: 'strong',
    loginAttempts: '5',
    adminIpWhitelist: false
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    customCss: ''
  });

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'advanced', label: 'Advanced', icon: Database }
  ];

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success(`${section} settings saved successfully!`);
  };

  const handleBackup = () => {
    const backupData = {
      general: generalSettings,
      payment: paymentSettings,
      notifications: notificationSettings,
      security: securitySettings,
      appearance: appearanceSettings,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Settings backup downloaded!');
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="w-5 h-5 mr-2" />
            Store Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <Input
                value={generalSettings.siteName}
                onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
              <Input
                value={generalSettings.siteUrl}
                onChange={(e) => setGeneralSettings({...generalSettings, siteUrl: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              value={generalSettings.siteDescription}
              onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <Input
                type="email"
                value={generalSettings.contactEmail}
                onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <Input
                value={generalSettings.contactPhone}
                onChange={(e) => setGeneralSettings({...generalSettings, contactPhone: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <Input
              value={generalSettings.address}
              onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={generalSettings.timezone}
                onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
              >
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={generalSettings.currency}
                onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={generalSettings.language}
                onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={() => handleSaveSettings('General')} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'razorpayEnabled', label: 'Razorpay', description: 'Indian payment gateway' },
            { key: 'paypalEnabled', label: 'PayPal', description: 'International payments' },
            { key: 'stripeEnabled', label: 'Stripe', description: 'Credit card processing' },
            { key: 'codEnabled', label: 'Cash on Delivery', description: 'Pay on delivery' },
            { key: 'bankTransferEnabled', label: 'Bank Transfer', description: 'Direct bank transfer' }
          ].map(method => (
            <div key={method.key} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">{method.label}</h4>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentSettings[method.key as keyof typeof paymentSettings] as boolean}
                  onChange={(e) => setPaymentSettings({
                    ...paymentSettings,
                    [method.key]: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <Input
                type="number"
                value={paymentSettings.taxRate}
                onChange={(e) => setPaymentSettings({...paymentSettings, taxRate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Fee (₹)</label>
              <Input
                type="number"
                value={paymentSettings.shippingFee}
                onChange={(e) => setPaymentSettings({...paymentSettings, shippingFee: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={() => handleSaveSettings('Payment')} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
            { key: 'pushNotifications', label: 'Push Notifications', description: 'Browser push notifications' },
            { key: 'orderNotifications', label: 'Order Updates', description: 'New orders and status changes' },
            { key: 'stockAlerts', label: 'Stock Alerts', description: 'Low stock and inventory warnings' },
            { key: 'customerUpdates', label: 'Customer Updates', description: 'New registrations and inquiries' },
            { key: 'marketingEmails', label: 'Marketing Emails', description: 'Promotional and marketing content' }
          ].map(notification => (
            <div key={notification.key} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">{notification.label}</h4>
                <p className="text-sm text-gray-600">{notification.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings[notification.key as keyof typeof notificationSettings] as boolean}
                  onChange={(e) => setNotificationSettings({
                    ...notificationSettings,
                    [notification.key]: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={() => handleSaveSettings('Notifications')} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={securitySettings.twoFactorAuth ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {securitySettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
              </Badge>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  setSecuritySettings({
                    ...securitySettings,
                    twoFactorAuth: !securitySettings.twoFactorAuth
                  });
                  toast.success(`Two-factor authentication ${securitySettings.twoFactorAuth ? 'disabled' : 'enabled'}!`);
                }}
              >
                {securitySettings.twoFactorAuth ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
              <Input
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
              <Input
                type="number"
                value={securitySettings.loginAttempts}
                onChange={(e) => setSecuritySettings({...securitySettings, loginAttempts: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Policy</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md"
              value={securitySettings.passwordPolicy}
              onChange={(e) => setSecuritySettings({...securitySettings, passwordPolicy: e.target.value})}
            >
              <option value="basic">Basic (6+ characters)</option>
              <option value="strong">Strong (8+ chars, mixed case, numbers)</option>
              <option value="very-strong">Very Strong (12+ chars, special characters)</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Admin IP Whitelist</h4>
              <p className="text-sm text-gray-600">Restrict admin access to specific IP addresses</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.adminIpWhitelist}
                onChange={(e) => setSecuritySettings({...securitySettings, adminIpWhitelist: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={() => handleSaveSettings('Security')} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Settings | Admin | RECON AUTOBOTS</title>
        <meta name="description" content="Admin settings and configuration for RECON AUTOBOTS" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={handleBackup}>
                  <Download className="w-4 h-4 mr-2" />
                  Backup Settings
                </Button>
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{user?.username}</span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64">
              <Card>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <tab.icon className="w-4 h-4 mr-3" />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'general' && renderGeneralSettings()}
                {activeTab === 'payment' && renderPaymentSettings()}
                {activeTab === 'notifications' && renderNotificationSettings()}
                {activeTab === 'security' && renderSecuritySettings()}
                
                {activeTab === 'shipping' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Shipping configuration coming soon...</p>
                    </CardContent>
                  </Card>
                )}
                
                {activeTab === 'appearance' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Theme and appearance customization coming soon...</p>
                    </CardContent>
                  </Card>
                )}
                
                {activeTab === 'advanced' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Advanced Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">Advanced configuration options coming soon...</p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminSettings;
