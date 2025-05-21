module.exports = {
  // Ensure user is authenticated
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/users/login');
  },
  
  // Ensure user is an admin
  ensureAdmin: function(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    req.flash('error_msg', 'Access denied. Admin privileges required');
    res.redirect('/');
  },
  
  // Ensure user is not authenticated (for login/register pages)
  ensureNotAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');
  },
  
  // Ensure user is the owner of a listing or an admin
  ensureOwnerOrAdmin: async function(req, res, next) {
    try {
      const listing = await require('../models/Listing').findById(req.params.id);
      
      if (!listing) {
        req.flash('error_msg', 'Listing not found');
        return res.redirect('/listings');
      }
      
      if (listing.seller.equals(req.user._id) || req.user.role === 'admin') {
        return next();
      }
      
      req.flash('error_msg', 'Not authorized');
      res.redirect('/listings');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error');
      res.redirect('/listings');
    }
  }
};