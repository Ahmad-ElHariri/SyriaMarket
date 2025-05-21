const User = require('../models/User');
const Listing = require('../models/Listing');

module.exports = {
  // Render admin dashboard
  renderAdminDashboard: async (req, res) => {
    try {
      // Get counts
      const userCount = await User.countDocuments();
      const listingCount = await Listing.countDocuments();
      const activeListingCount = await Listing.countDocuments({ isActive: true });
      const featuredListingCount = await Listing.countDocuments({ isFeatured: true });
      
      // Get recent users
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(5);
      
      // Get recent listings
      const recentListings = await Listing.find()
        .populate('seller', 'username')
        .sort({ createdAt: -1 })
        .limit(5);
      
      res.render('admin/dashboard', {
        title: 'Admin Dashboard - SyriaMarket',
        counts: {
          users: userCount,
          listings: listingCount,
          activeListings: activeListingCount,
          featuredListings: featuredListingCount
        },
        recentUsers,
        recentListings
      });
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error');
      res.redirect('/');
    }
  },
  
  // Render users management
  renderUsersManagement: async (req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      
      res.render('admin/users', {
        title: 'Users Management - SyriaMarket',
        users
      });
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error');
      res.redirect('/admin');
    }
  },
  
  // Toggle user active status
  toggleUserStatus: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        req.flash('error_msg', 'User not found');
        return res.redirect('/admin/users');
      }
      
      // Prevent deactivating yourself
      if (user._id.equals(req.user._id)) {
        req.flash('error_msg', 'You cannot deactivate your own account');
        return res.redirect('/admin/users');
      }
      
      // Toggle status
      user.isActive = !user.isActive;
      await user.save();
      
      const statusText = user.isActive ? 'activated' : 'deactivated';
      req.flash('success_msg', `User ${user.username} has been ${statusText}`);
      res.redirect('/admin/users');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error');
      res.redirect('/admin/users');
    }
  },
  
  // Render listings management
  renderListingsManagement: async (req, res) => {
    try {
      const listings = await Listing.find()
        .populate('seller', 'username')
        .sort({ createdAt: -1 });
      
      res.render('admin/listings', {
        title: 'Listings Management - SyriaMarket',
        listings
      });
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error');
      res.redirect('/admin');
    }
  },
  
  // Toggle listing active status
  toggleListingStatus: async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id);
      
      if (!listing) {
        req.flash('error_msg', 'Listing not found');
        return res.redirect('/admin/listings');
      }
      
      // Toggle status
      listing.isActive = !listing.isActive;
      await listing.save();
      
      const statusText = listing.isActive ? 'activated' : 'deactivated';
      req.flash('success_msg', `Listing has been ${statusText}`);
      res.redirect('/admin/listings');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error');
      res.redirect('/admin/listings');
    }
  },
  
  // Toggle listing featured status
  toggleListingFeatured: async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id);
      
      if (!listing) {
        req.flash('error_msg', 'Listing not found');
        return res.redirect('/admin/listings');
      }
      
      // Toggle featured status
      listing.isFeatured = !listing.isFeatured;
      await listing.save();
      
      const statusText = listing.isFeatured ? 'set as featured' : 'removed from featured';
      req.flash('success_msg', `Listing has been ${statusText}`);
      res.redirect('/admin/listings');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error');
      res.redirect('/admin/listings');
    }
  }
};