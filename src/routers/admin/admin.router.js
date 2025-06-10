const express = require('express');
const { inviteAdmin, adminSignup } = require('../../controllers/admin/admin.controller');
const router = express.Router();


router.post('/inviteadmin', inviteAdmin);
router.post('/adminsignup/:token', adminSignup); 


module.exports = router;