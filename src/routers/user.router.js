const express = require('express');
const { userSignup, userLogin, verifyUser, forgotPassword, resetPassword, testid } = require('../controllers/user.controller');
const router = express.Router();


router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/verify', verifyUser);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);
router.get('/test', testid); 

module.exports = router;