const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureNotAuthenticated } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Register page
router.get('/register', ensureNotAuthenticated, userController.renderRegister);

// Register handle
router.post('/register', ensureNotAuthenticated, userController.register);

// Login page
router.get('/login', ensureNotAuthenticated, userController.renderLogin);

// Login handle
router.post('/login', ensureNotAuthenticated, userController.login);

// Logout handle
router.get('/logout', userController.logout);

// Profile page
router.get('/profile', ensureAuthenticated, userController.renderProfile);

// Edit profile page
router.get('/edit-profile', ensureAuthenticated, userController.renderEditProfile);

// Update profile
router.put('/edit-profile', ensureAuthenticated, userController.updateProfile);

module.exports = router;