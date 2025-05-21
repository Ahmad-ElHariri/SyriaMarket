const express = require('express');
const router = express.Router();
const { ensureAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Admin dashboard
router.get('/', ensureAdmin, adminController.renderAdminDashboard);

// Users management
router.get('/users', ensureAdmin, adminController.renderUsersManagement);

// Toggle user status
router.put('/users/:id/toggle-status', ensureAdmin, adminController.toggleUserStatus);

// Listings management
router.get('/listings', ensureAdmin, adminController.renderListingsManagement);

// Toggle listing status
router.put('/listings/:id/toggle-status', ensureAdmin, adminController.toggleListingStatus);

// Toggle listing featured status
router.put('/listings/:id/toggle-featured', ensureAdmin, adminController.toggleListingFeatured);

module.exports = router;