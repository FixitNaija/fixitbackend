const express = require('express');
const { inviteAdmin, adminSignup, adminLogin, adminDashboard } = require('../../controllers/admin/admin.controller');
const isAuthenticated = require('../../middleware/isAuthenticated');
const router = express.Router();


router.post('/inviteadmin', inviteAdmin);
router.post('/signup/:token', adminSignup);
router.post('/login', adminLogin);
router.get('/dashboard', isAuthenticated, adminDashboard);

module.exports = router; 