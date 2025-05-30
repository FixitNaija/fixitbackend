const express = require('express');
const { userSignup, userLogin, verifyUser, forgotPassword, resetPassword } = require('../controllers/user.controller');
const router = express.Router();


router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/verify', verifyUser);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);

module.exports = router;