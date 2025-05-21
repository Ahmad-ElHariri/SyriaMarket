const Listing = require('../models/Listing');
const fs = require('fs');
const path = require('path');

module.exports = {
  // Get all listings with filters
  getListings: async (req, res) => {
    try {
      const filter = {};

      if (req.query.category && req.query.category !== 'all') {
        filter.category = req.query.category;
      }

      if (req.query.city && req.query.city !== 'all') {
        filter['location.city'] = req.query.city;
      }

      if (req.query.condition && req.query.condition !== 'all') {
        filter.condition = req.query.condition;
      }

      if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};
        if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
      }

      if (req.query.keyword) {
        filter.$text = { $search: req.query.keyword };
      }

      filter.isActive = true;
      const cities = await Listing.distinct('location.city');
      const page = parseInt(req.query.page) || 1;
      const limit = 12;
      const skip = (page - 1) * limit;

      const listings = await Listing.find(filter)
        .populate('seller', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalListings = await Listing.countDocuments(filter);
      const totalPages = Math.ceil(totalListings / limit);

      // ✅ FIXED: Added return
      return res.render('listings/index', {
        title: 'Listings - SyriaMarket',
        listings,
        currentPage: page,
        totalPages,
        totalListings,
        query: req.query,
        cities,
        filter
      });
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error');
      // ✅ FIXED: Added return
      return res.redirect('/');
    }
  },

  // Get single listing
  getListing: async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id)
        .populate('seller', 'username fullName city createdAt');

      if (!listing) {
        req.flash('error_msg', 'Listing not found');
        // ✅ FIXED: Added return
        return res.redirect('/listings');
      }

      listing.views += 1;
      await listing.save();

      const sellerListings = await Listing.find({
        seller: listing.seller._id,
        _id: { $ne: listing._id },
        isActive: true
      }).limit(4).sort({ createdAt: -1 });

      const similarListings = await Listing.find({
        category: listing.category,
        _id: { $ne: listing._id },
        isActive: true
      }).limit(4).sort({ createdAt: -1 });

      // ✅ FIXED: Added return
      return res.render('listings/show', {
        title: `${listing.title} - SyriaMarket`,
        listing,
        sellerListings,
        similarListings
      });
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error');
      // ✅ FIXED: Added return
      return res.redirect('/listings');
    }
  },

  // Render create listing page
  renderCreateListing: (req, res) => {
    // ✅ FIXED: Added return
    return res.render('listings/create', {
      title: 'Create Listing - SyriaMarket'
    });
  },

  // Create new listing
  createListing: async (req, res) => {
    try {
      const { title, description, price, category, condition, city, address, contactPhone } = req.body;
      const images = [];

      if (req.files && req.files.length > 0) {
        req.files.forEach(file => images.push(file.filename));
      } else {
        images.push('default-listing.jpg');
      }

      const newListing = new Listing({
        title, description, price, category, condition,
        location: { city, address }, images,
        seller: req.user._id, contactPhone
      });

      await newListing.save();
      req.flash('success_msg', 'Listing created successfully');
      // ✅ FIXED: Added return
      return res.redirect(`/listings/${newListing._id}`);
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error');
      // ✅ FIXED: Added return
      return res.redirect('/listings/create');
    }
  },

  // Render edit listing page
  renderEditListing: async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        req.flash('error_msg', 'Listing not found');
        // ✅ FIXED: Added return
        return res.redirect('/listings');
      }

      if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        req.flash('error_msg', 'Not authorized');
        // ✅ FIXED: Added return
        return res.redirect('/listings');
      }

      // ✅ FIXED: Added return
      return res.render('listings/edit', {
        title: 'Edit Listing - SyriaMarket',
        listing
      });
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error');
      // ✅ FIXED: Added return
      return res.redirect('/listings');
    }
  },

  // Update listing
  updateListing: async (req, res) => {
    try {
      const { title, description, price, category, condition, city, address, contactPhone } = req.body;
      const listing = await Listing.findById(req.params.id);

      if (!listing) {
        req.flash('error_msg', 'Listing not found');
        // ✅ FIXED: Added return
        return res.redirect('/listings');
      }

      if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        req.flash('error_msg', 'Not authorized');
        // ✅ FIXED: Added return
        return res.redirect('/listings');
      }

      let images = listing.images;
      if (req.files && req.files.length > 0) {
        if (images[0] !== 'default-listing.jpg') {
          images.forEach(img => {
            const imagePath = path.join(__dirname, '../public/uploads', img);
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          });
        }

        images = req.files.map(file => file.filename);
      }

      Object.assign(listing, {
        title, description, price, category, condition,
        location: { city, address }, contactPhone, images
      });

      await listing.save();
      req.flash('success_msg', 'Listing updated successfully');
      // ✅ FIXED: Added return
      return res.redirect(`/listings/${listing._id}`);
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error');
      // ✅ FIXED: Added return
      return res.redirect(`/listings/edit/${req.params.id}`);
    }
  },

  // Delete listing
  deleteListing: async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id);

      if (!listing) {
        req.flash('error_msg', 'Listing not found');
        // ✅ FIXED: Added return
        return res.redirect('/listings');
      }

      if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        req.flash('error_msg', 'Not authorized');
        // ✅ FIXED: Added return
        return res.redirect('/listings');
      }

      if (listing.images[0] !== 'default-listing.jpg') {
        listing.images.forEach(img => {
          const imagePath = path.join(__dirname, '../public/uploads', img);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });
      }

      await listing.remove();
      req.flash('success_msg', 'Listing deleted successfully');
      // ✅ FIXED: Added return
      return res.redirect('/dashboard');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error');
      // ✅ FIXED: Added return
      return res.redirect('/dashboard');
    }
  }
};
