const express = require('express');
const { userSignup, userLogin, verifyUser, forgotPassword, resetPassword, testid, getProfile } = require('../controllers/user.controller');
const router = express.Router();

const isAuthenticated = require('../middleware/isAuthenticated')




router.post('/signup', userSignup);
router.post('/login', userLogin);
// router.get('/verify', verifyUser);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);

router.get('/test', testid); 
router.get('/profile', isAuthenticated, getProfile);


module.exports = router;