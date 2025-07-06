const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: 'https://fix-it-naija.onrender.com/Signup',
  successRedirect: 'https://fix-it-naija.onrender.com/UserPage'
}));

// Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;
