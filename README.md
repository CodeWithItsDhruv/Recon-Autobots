# RECON AUTOBOTS - E-commerce Platform

A comprehensive motorcycle riding gear e-commerce platform built with React, TypeScript, Firebase, and Razorpay.

## 🚀 Features

- **Complete E-commerce Platform**: Product catalog, shopping cart, checkout, and order management
- **Admin Panel**: Dashboard, inventory management, order tracking, analytics, and coupon management
- **Firebase Integration**: Authentication, Firestore database, and cloud storage
- **Payment Integration**: Razorpay payment gateway with invoice generation
- **BlueDart Tracking**: Integrated order tracking system
- **Responsive Design**: Mobile-first design with modern UI components
- **Security**: Role-based access control and secure admin authentication

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **Payments**: Razorpay
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Charts**: Recharts
- **PDF Generation**: jsPDF

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- Razorpay account

## 🔧 Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/CodeWithItsDhruv/Recon-Autobots.git
   cd Recon-Autobots
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your actual values:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Razorpay Configuration
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Admin Configuration
   VITE_ADMIN_INVITATION_CODE=your_admin_code

   # App Configuration
   VITE_APP_NAME=Your App Name
   VITE_APP_DESCRIPTION=Your App Description

   # Environment
   VITE_NODE_ENV=development
   ```

## 🔥 Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication, Firestore, Storage, and Analytics

2. **Configure Authentication**
   - Enable Email/Password authentication
   - Enable Google Sign-in
   - Set up authorized domains

3. **Firestore Database**
   - Create collections: `users`, `products`, `orders`, `coupons`
   - Set up security rules

4. **Storage**
   - Configure storage rules for product images

## 💳 Razorpay Setup

1. **Create Razorpay Account**
   - Sign up at [Razorpay](https://razorpay.com/)
   - Get your API keys from the dashboard

2. **Configure Webhook**
   - Set up webhook URL for payment verification
   - Configure events: `payment.captured`, `payment.failed`

## 🚀 Development

1. **Start development server**
   ```bash
   npm run dev
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries and services
├── pages/             # Page components
│   ├── admin/         # Admin panel pages
│   └── ...            # Public pages
├── assets/            # Static assets
└── data/              # Static data files
```

## 🔐 Security Features

- **Environment Variables**: All sensitive data stored in `.env` file
- **Admin Protection**: Secure invitation code system
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Client and server-side validation
- **Firebase Security Rules**: Database and storage protection

## 🌐 Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Configure build settings and deploy

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build and deploy: `npm run build && firebase deploy`

## 📱 Admin Panel Access

- **URL**: `/admin/login`
- **Invitation Code**: Set in `VITE_ADMIN_INVITATION_CODE` environment variable
- **Default Code**: `WELRAB`

## 🛒 Features Overview

### Customer Features
- Browse products with filtering and search
- Add to cart and checkout
- Order tracking with BlueDart integration
- User authentication and profile management
- Invoice generation and download

### Admin Features
- Dashboard with analytics and metrics
- Product inventory management
- Order management and tracking
- Coupon creation and management
- User management
- Analytics and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: [Your Contact Information]

## 🔄 Updates

- **v1.0.0**: Initial release with basic e-commerce functionality
- **v1.1.0**: Added admin panel and Firebase integration
- **v1.2.0**: Enhanced UI with detailed order cards and modal views
- **v1.3.0**: Added environment variable security and improved configuration

---

**Built with ❤️ by [Your Name]**