const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Start Google OAuth
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'https://fix-it-naija.onrender.com/Signup',
    session: false, 
  }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      {
        user: {
          id: user._id,
          name: user.firstName,
          email: user.email,
        },
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION_USER,
      }
    );

    // Build redirect URL with token and user info
    const redirectUrl = `https://fix-it-naija.onrender.com/UserPage?token=${token}&name=${encodeURIComponent(
      user.firstName
    )}&email=${encodeURIComponent(user.email)}`;

    res.redirect(redirectUrl);
  }
);

// Logout (optional if using sessions)
router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: 'Logout error' });
    }
    res.redirect('/');
  });
});

module.exports = router;

