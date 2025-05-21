const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'clothing', 'furniture', 'vehicles', 'real-estate', 'services', 'jobs', 'other']
  },
  condition: {
    type: String,
    required: true,
    enum: ['new', 'like-new', 'good', 'fair', 'poor']
  },
  location: {
    city: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  images: [{
    type: String,
    required: true
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  }
});

// Create indexes for better search performance
ListingSchema.index({ title: 'text', description: 'text' });
ListingSchema.index({ category: 1 });
ListingSchema.index({ 'location.city': 1 });
ListingSchema.index({ price: 1 });
ListingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Listing', ListingSchema);