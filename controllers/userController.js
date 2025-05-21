const User = require('../models/User');
const Listing = require('../models/Listing');
const passport = require('passport');

module.exports = {
  // Render register page
  renderRegister: (req, res) => {
    res.render('users/register', {
      title: 'Register - SyriaMarket'
    });
  },
  
  // Handle user registration
  register: async (req, res) => {
    try {
      const { username, email, password, confirmPassword, fullName, phone, city } = req.body;
      
      // Validation
      let errors = [];
      
      if (!username || !email || !password || !confirmPassword || !fullName || !city) {
        errors.push({ msg: 'Please fill in all required fields' });
      }
      
      if (password !== confirmPassword) {
        errors.push({ msg: 'Passwords do not match' });
      }
      
      if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
      }
      
      if (errors.length > 0) {
        return res.render('users/register', {
          title: 'Register - SyriaMarket',
          errors,
          username,
          email,
          fullName,
          phone,
          city
        });
      }
      
      // Check if email already exists
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        errors.push({ msg: 'Email is already registered' });
        return res.render('users/register', {
          title: 'Register - SyriaMarket',
          errors,
          username,
          fullName,
          phone,
          city
        });
      }
      
      // Check if username already exists
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        errors.push({ msg: 'Username is already taken' });
        return res.render('users/register', {
          title: 'Register - SyriaMarket',
          errors,
          email,
          fullName,
          phone,
          city
        });
      }
      
      // Create new user
      const newUser = new User({
        username,
        email,
        password,
        fullName,
        phone,
        city
      });
      
      // Save user
      await newUser.save();
      
      req.flash('success_msg', 'You are now registered and can log in');
      res.redirect('/users/login');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error during registration');
      res.redirect('/users/register');
    }
  },
  
  // Render login page
  renderLogin: (req, res) => {
    res.render('users/login', {
      title: 'Login - SyriaMarket'
    });
  },
  
  // Handle user login
  login: (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  },
  
  // Handle user logout
  logout: (req, res) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success_msg', 'You are logged out');
      res.redirect('/users/login');
    });
  },
  
  // Render user profile
  renderProfile: async (req, res) => {
    try {
      const listings = await Listing.find({ seller: req.user._id })
        .sort({ createdAt: -1 });
      
      res.render('users/profile', {
        title: 'My Profile - SyriaMarket',
        user: req.user,
        listings
      });
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error');
      res.redirect('/dashboard');
    }
  },
  
  // Render edit profile page
  renderEditProfile: (req, res) => {
    res.render('users/edit-profile', {
      title: 'Edit Profile - SyriaMarket',
      user: req.user
    });
  },
  
  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { fullName, phone, city } = req.body;
      
      // Update user
      await User.findByIdAndUpdate(req.user._id, {
        fullName,
        phone,
        city
      });
      
      req.flash('success_msg', 'Profile updated successfully');
      res.redirect('/users/profile');
    } catch (err) {
      console.error(err);
      req.flash('error_msg', 'Server error');
      res.redirect('/users/edit-profile');
    }
  }
};