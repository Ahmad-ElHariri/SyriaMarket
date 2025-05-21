module.exports = {
  // Application settings
  app: {
    name: 'SyriaMarket',
    description: 'Online marketplace for buying and selling in Syria',
    url: process.env.APP_URL || 'http://localhost:3000'
  },
  
  // Database settings
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/syriamarket'
  },
  
  // Session settings
  session: {
    secret: process.env.SESSION_SECRET || 'syria-market-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
  },
  
  // Upload settings
  upload: {
    directory: 'public/uploads',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
  },
  
  // Available cities
  cities: [
    'Damascus',
    'Aleppo',
    'Homs',
    'Latakia',
    'Hama',
    'Deir ez-Zor',
    'Idlib',
    'Tartus',
    'Raqqa',
    'Daraa',
    'Al-Hasakah',
    'Quneitra',
    'As-Suwayda'
  ],
  
  // Categories
  categories: [
    {
      name: 'electronics',
      displayName: 'Electronics',
      icon: 'fa-laptop'
    },
    {
      name: 'clothing',
      displayName: 'Clothing',
      icon: 'fa-tshirt'
    },
    {
      name: 'furniture',
      displayName: 'Furniture',
      icon: 'fa-couch'
    },
    {
      name: 'vehicles',
      displayName: 'Vehicles',
      icon: 'fa-car'
    },
    {
      name: 'real-estate',
      displayName: 'Real Estate',
      icon: 'fa-home'
    },
    {
      name: 'services',
      displayName: 'Services',
      icon: 'fa-tools'
    },
    {
      name: 'jobs',
      displayName: 'Jobs',
      icon: 'fa-briefcase'
    },
    {
      name: 'other',
      displayName: 'Other',
      icon: 'fa-box'
    }
  ],
  
  // Item conditions
  conditions: [
    {
      name: 'new',
      displayName: 'New'
    },
    {
      name: 'like-new',
      displayName: 'Like New'
    },
    {
      name: 'good',
      displayName: 'Good'
    },
    {
      name: 'fair',
      displayName: 'Fair'
    },
    {
      name: 'poor',
      displayName: 'Poor'
    }
  ]
};