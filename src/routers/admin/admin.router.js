const express = require('express');
const { inviteAdmin, adminSignup } = require('../../controllers/admin/admin.controller');
const isAuthenticated = require('../../middleware/isAuthenticated');
const router = express.Router();


router.post('/inviteadmin', isAuthenticated, inviteAdmin);
router.post('/adminsignup/:token', isAuthenticated, adminSignup); 


module.exports = router;