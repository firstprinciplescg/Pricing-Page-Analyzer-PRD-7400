// Application Configuration
export const APP_CONFIG = {
  // Domain Configuration
  DOMAIN: import.meta.env.VITE_DOMAIN || 'peppy-alpaca-1b7a23.netlify.app',
  PROTOCOL: import.meta.env.VITE_PROTOCOL || 'https',
  
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || `https://peppy-alpaca-1b7a23.netlify.app`,
  
  // App Information
  APP_NAME: 'Pricing Page Analyzer',
  APP_VERSION: '1.0.0',
  
  // Feature Flags
  FEATURES: {
    ADMIN_PANEL: true,
    COMPETITOR_COMPARE: true,
    SCHEDULED_SCANS: true,
    EXPORT_PDF: true
  },
  
  // Plan Limits
  PLANS: {
    free: {
      name: 'Free',
      scanLimit: 3,
      features: ['Basic analysis', 'Grade reports', 'Email support']
    },
    pro: {
      name: 'Pro',
      scanLimit: null, // unlimited
      price: 25,
      features: ['Unlimited scans', 'Competitor compare', 'Priority support', 'PDF exports']
    },
    enterprise: {
      name: 'Enterprise',
      scanLimit: null, // unlimited
      price: 99,
      features: ['Everything in Pro', 'Scheduled scans', 'Team collaboration', 'Admin dashboard', 'API access']
    }
  },
  
  // Admin Configuration
  ADMIN_EMAILS: [
    'mdustinmoore@gmail.com'
  ]
};

// Helper functions
export const getFullUrl = (path = '') => {
  return `${APP_CONFIG.PROTOCOL}://${APP_CONFIG.DOMAIN}${path}`;
};

export const isAdminEmail = (email) => {
  return APP_CONFIG.ADMIN_EMAILS.includes(email?.toLowerCase());
};

export const getPlanConfig = (planName) => {
  return APP_CONFIG.PLANS[planName] || APP_CONFIG.PLANS.free;
};