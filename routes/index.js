const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const indexController = require('../controllers/indexController');

// Home page
router.get('/', indexController.renderHome);

// Dashboard
router.get('/dashboard', ensureAuthenticated, indexController.renderDashboard);

// About page
router.get('/about', indexController.renderAbout);

// Contact page
router.get('/contact', indexController.renderContact);

module.exports = router;