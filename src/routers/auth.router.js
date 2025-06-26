const express = require('express');
const passport = require('passport');
const router = express.Router();

// Route for initiating Google OAuth
router.get('/', passport.authenticate('google', {scope: ['profile', 'email']}));

// Google OAuth callback route
router.get('/callback', passport.authenticate('google', { 
        failureRedirect: '/login',
        successRedirect: '/dashboard'
    })
);

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;