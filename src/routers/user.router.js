const express = require('express');
const { userSignup, userLogin, verifyUser, forgotPassword, resetPassword, getProfile } = require('../controllers/user.controller');
const { myIssues } = require('../controllers/user.controller');
const isAuthenticated = require('../middleware/isAuthenticated'); 
const router = express.Router();




router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/verify', verifyUser);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);
router.get('/profile', isAuthenticated, getProfile);
router.get('/myissues', isAuthenticated, myIssues);


module.exports = router;
