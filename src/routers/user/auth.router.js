const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authenticate = require('../../middleware/isAuthenticated');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

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

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect('https://fix-it-naija.onrender.com/UserPage');
  }
);

router.get('/logout', (req, res) => {
  res.clearCookie('jwt', {
    secure: true,
    sameSite: 'None',
  });
  res.redirect('https://fix-it-naija.onrender.com/');
});

//  profile route
router.get('/profile', authenticate, (req, res) => {
  res.json({
    message: `Welcome back, ${req.user.name}`,
    user: req.user,
  });
});

module.exports = router;
