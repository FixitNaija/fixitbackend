const express = require('express');
const { userSignup, verifyUser, forgotPassword, resetPassword } = require('../controllers/user.controller');
const router = express.Router();
const multer = require('../utils/multer');


router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/verify', verifyUser);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);

module.exports = router;