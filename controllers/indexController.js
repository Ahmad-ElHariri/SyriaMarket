const Listing = require('../models/Listing');

module.exports = {
  // Render home page
  renderHome: async (req, res) => {
    try {
      const featuredListings = await Listing.find({ isFeatured: true, isActive: true })
        .populate('seller', 'username')
        .sort({ createdAt: -1 })
        .limit(6);

      const recentListings = await Listing.find({ isActive: true })
        .populate('seller', 'username')
        .sort({ createdAt: -1 })
        .limit(8);

      const categories = [
        { name: 'electronics', displayName: 'Electronics', icon: 'fa-laptop' },
        { name: 'clothing', displayName: 'Clothing', icon: 'fa-tshirt' },
        { name: 'furniture', displayName: 'Furniture', icon: 'fa-couch' },
        { name: 'vehicles', displayName: 'Vehicles', icon: 'fa-car' },
        { name: 'real-estate', displayName: 'Real Estate', icon: 'fa-home' },
        { name: 'services', displayName: 'Services', icon: 'fa-tools' },
        { name: 'jobs', displayName: 'Jobs', icon: 'fa-briefcase' },
        { name: 'other', displayName: 'Other', icon: 'fa-box' }
      ];

      for (const category of categories) {
        category.count = await Listing.countDocuments({ 
          category: category.name,
          isActive: true
        });
      }

      const cities = await Listing.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$location.city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 }
      ]);

      // ✅ FIXED: Added return
      return res.render('index', {
        title: 'SyriaMarket - Buy & Sell in Syria',
        featuredListings,
        recentListings,
        categories,
        cities
      });
    } catch (err) {
      console.error(err);
      if (!res.headersSent) {
        // ✅ FIXED: Added safety check and return
        return res.status(500).render('errors/500', {
          title: '500 - Server Error'
        });
      }
    }
  },

  // Render dashboard
  renderDashboard: async (req, res) => {
    try {
      const listings = await Listing.find({ seller: req.user._id })
        .sort({ createdAt: -1 });

      // ✅ FIXED: Added return
      return res.render('dashboard', {
        title: 'Dashboard - SyriaMarket',
        listings
      });
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error');
      // ✅ FIXED: Added return
      return res.redirect('/');
    }
  },

  // Render about page
  renderAbout: (req, res) => {
    // ✅ FIXED: Added return
    return res.render('about', {
      title: 'About - SyriaMarket'
    });
  },

  // Render contact page
  renderContact: (req, res) => {
    // ✅ FIXED: Added return
    return res.render('contact', {
      title: 'Contact - SyriaMarket'
    });
  }
};
