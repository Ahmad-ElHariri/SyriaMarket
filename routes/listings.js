const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureOwnerOrAdmin } = require('../middleware/auth');
const listingController = require('../controllers/listingController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Initialize upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Get all listings
router.get('/', listingController.getListings);

// Create listing page
router.get('/create', ensureAuthenticated, listingController.renderCreateListing);

// Create listing
router.post('/', ensureAuthenticated, upload.array('images', 5), listingController.createListing);

// Get single listing
router.get('/:id', listingController.getListing);

// Edit listing page
router.get('/edit/:id', ensureAuthenticated, ensureOwnerOrAdmin, listingController.renderEditListing);

// Update listing
router.put('/:id', ensureAuthenticated, ensureOwnerOrAdmin, upload.array('images', 5), listingController.updateListing);

// Delete listing
router.delete('/:id', ensureAuthenticated, ensureOwnerOrAdmin, listingController.deleteListing);

module.exports = router;