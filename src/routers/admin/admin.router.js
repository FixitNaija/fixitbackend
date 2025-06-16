const express = require('express');
const { inviteAdmin, adminSignup, adminLogin } = require('../../controllers/admin/admin.controller');
const isAuthenticated = require('../../middleware/isAuthenticated');
const router = express.Router();


router.post('/inviteadmin', inviteAdmin);
router.post('/signup/:token', adminSignup);
router.post('/login', isAuthenticated, adminLogin);

module.exports = router;