const express = require('express');
const passport = require('passport');
const router = express.Router();


router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));


router.get('/auth/google/profile', passport.authenticate('google', { 
        failureRedirect: '/api/v1/user/login',
        successRedirect: '/api/v1/user/profile'
    })
);

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;