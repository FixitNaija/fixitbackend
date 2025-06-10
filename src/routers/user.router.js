const express = require('express');
const { userSignup, userLogin, verifyUser, forgotPassword, resetPassword, testid } = require('../controllers/user.controller');
const router = express.Router();
const {isAuthenticated} = require('../middleware/isAuthenticated')



router.post('/signup', userSignup);
router.post('/login', userLogin);
//router.get('/verify', verifyUser);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);


router.get('/profile', isAuthenticated, (req, res) => {
    res.json({
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        profilePicture: req.user.profilePicture,
        googleId: req.user.googleId
    });
});

module.exports = router;
