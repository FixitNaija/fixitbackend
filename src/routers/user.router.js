const express = require('express');
const { userSignup, userLogin, verifyUser, forgotPassword, resetPassword, getProfile, getDashboardMetrics } = require('../controllers/user.controller');
const router = express.Router();

const isAuthenticated = require('../middleware/isAuthenticated')


router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/verify', verifyUser);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);
router.get('/profile', isAuthenticated, getProfile);
router.get('/dashboard-metrics', isAuthenticated, getDashboardMetrics);


module.exports = router;
