const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Listing = require('../models/Listing');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB with increased timeout and more robust options
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/syriamarket';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000, // Increase socket timeout
  connectTimeoutMS: 30000, // Increase connect timeout
  keepAlive: true,
  keepAliveInitialDelay: 300000 // 5 minutes
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Rest of the seed.js file remains unchanged
const users = [
  {
    username: 'admin',
    email: 'admin@syriamarket.com',
    password: 'admin123',
    fullName: 'Admin User',
    phone: '+963123456789',
    city: 'Damascus',
    role: 'admin'
  },
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    fullName: 'John Doe',
    phone: '+963987654321',
    city: 'Aleppo'
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    fullName: 'Jane Smith',
    phone: '+963112233445',
    city: 'Homs'
  }
];

const categories = ['electronics', 'clothing', 'furniture', 'vehicles', 'real-estate', 'services', 'jobs', 'other'];
const conditions = ['new', 'like-new', 'good', 'fair', 'poor'];
const cities = ['Damascus', 'Aleppo', 'Homs', 'Latakia', 'Hama', 'Deir ez-Zor', 'Idlib', 'Tartus'];

const listings = [
  {
    title: 'Samsung Galaxy S22 Ultra - Almost New',
    description: 'Selling my Samsung Galaxy S22 Ultra. Used for only 2 months. Comes with original box, charger, and accessories. No scratches or dents.',
    price: 800,
    category: 'electronics',
    condition: 'like-new',
    location: {
      city: 'Damascus',
      address: 'Mezzeh, Damascus'
    },
    images: ['default-listing.jpg'],
    contactPhone: '+963123456789'
  },
  {
    title: 'Modern Sofa Set - 3 Pieces',
    description: 'Beautiful modern sofa set. Includes 3-seater, 2-seater, and armchair. Color: Dark Gray. Material: High-quality fabric. Very comfortable and in excellent condition.',
    price: 600,
    category: 'furniture',
    condition: 'good',
    location: {
      city: 'Aleppo',
      address: 'Shahba, Aleppo'
    },
    images: ['default-listing.jpg'],
    contactPhone: '+963987654321'
  },
  {
    title: 'Studio Apartment for Rent',
    description: 'Cozy studio apartment in central Homs. Furnished with all essentials. Includes kitchen appliances, bed, wardrobe, and small dining table. Utilities not included.',
    price: 300,
    category: 'real-estate',
    condition: 'good',
    location: {
      city: 'Homs',
      address: 'Downtown, Homs'
    },
    images: ['default-listing.jpg'],
    contactPhone: '+963112233445'
  },
  {
    title: 'Web Developer Needed',
    description: 'Looking for an experienced web developer for an ongoing project. Must have experience with HTML, CSS, JavaScript, and Node.js. Remote work possible.',
    price: 1000,
    category: 'jobs',
    condition: 'new',
    location: {
      city: 'Damascus',
      address: 'Baramkeh, Damascus'
    },
    images: ['default-listing.jpg'],
    contactPhone: '+963123456789'
  }
];

// Generate random listings
const generateRandomListings = (userId) => {
  const randomListings = [];
  
  for (let i = 0; i < 10; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    let title, description;
    let price = Math.floor(Math.random() * 1000) + 50;
    
    switch (category) {
      case 'electronics':
        title = `${['iPhone', 'Samsung', 'Huawei', 'Xiaomi', 'Laptop', 'TV', 'Headphones'][Math.floor(Math.random() * 7)]} for sale`;
        description = 'Great condition electronics for sale. Contact for more details.';
        break;
      case 'clothing':
        title = `${['Men\'s', 'Women\'s', 'Children\'s'][Math.floor(Math.random() * 3)]} ${['Jacket', 'Shirt', 'Pants', 'Shoes', 'Dress'][Math.floor(Math.random() * 5)]}`;
        description = 'Quality clothing items for sale at a great price.';
        break;
      case 'furniture':
        title = `${['Modern', 'Antique', 'Wooden', 'Metal'][Math.floor(Math.random() * 4)]} ${['Sofa', 'Table', 'Chair', 'Bed', 'Wardrobe'][Math.floor(Math.random() * 5)]}`;
        description = 'Beautiful furniture piece available for immediate purchase.';
        break;
      case 'vehicles':
        title = `${['Toyota', 'Honda', 'Hyundai', 'Kia', 'Ford'][Math.floor(Math.random() * 5)]} ${['Sedan', 'SUV', 'Truck', 'Van'][Math.floor(Math.random() * 4)]} for sale`;
        price = Math.floor(Math.random() * 10000) + 2000;
        description = 'Well-maintained vehicle with low mileage. Contact for viewing.';
        break;
      case 'real-estate':
        title = `${['Apartment', 'House', 'Studio', 'Office Space', 'Land'][Math.floor(Math.random() * 5)]} for ${['Rent', 'Sale'][Math.floor(Math.random() * 2)]}`;
        price = Math.floor(Math.random() * 100000) + 10000;
        description = 'Great property in an excellent location. Contact for viewing.';
        break;
      default:
        title = `Random item #${i} for sale`;
        description = 'Miscellaneous item for sale. Contact for more details.';
    }
    
    randomListings.push({
      title,
      description,
      price,
      category,
      condition,
      location: {
        city,
        address: `${['Downtown', 'Suburb', 'Central', 'Eastern', 'Western', 'Northern', 'Southern'][Math.floor(Math.random() * 7)]}, ${city}`
      },
      images: ['default-listing.jpg'],
      seller: userId,
      contactPhone: '+963' + Math.floor(Math.random() * 1000000000),
      views: Math.floor(Math.random() * 100),
      isFeatured: Math.random() > 0.8
    });
  }
  
  return randomListings;
};

// Seed the database
const seedDB = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    
    // Create users
    const createdUsers = [];
    
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      const newUser = new User({
        ...user,
        password: hashedPassword
      });
      
      const savedUser = await newUser.save();
      createdUsers.push(savedUser);
    }
    
    // Create listings
    const listingsToCreate = [
      ...listings.map((listing, index) => ({
        ...listing,
        seller: createdUsers[Math.min(index, createdUsers.length - 1)]._id
      }))
    ];
    
    // Add random listings for each user
    for (const user of createdUsers) {
      const randomListings = generateRandomListings(user._id);
      listingsToCreate.push(...randomListings);
    }
    
    await Listing.insertMany(listingsToCreate);
    
    console.log('Database seeded successfully');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();