const express = require('express');
const { myIssues } = require('../controllers/user.controller');
const isAuthenticated = require('../middleware/isAuthenticated'); 
const { userSignup, userLogin, verifyUser, forgotPassword, resendOTP, getProfile, getDashboardMetrics } = require('../controllers/user.controller');
const router = express.Router();




router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/verify', verifyUser);
router.get('/resendotp', resendOTP);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);
router.get('/profile', isAuthenticated, getProfile);
router.get('/myissues', isAuthenticated, myIssues);
router.get('/dashboard-metrics', isAuthenticated, getDashboardMetrics);


module.exports = router;
