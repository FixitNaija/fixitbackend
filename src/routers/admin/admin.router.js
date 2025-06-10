const express = require('express');
const { inviteAdmin, adminSignup } = require('../../controllers/admin/admin.controller');
const router = express.Router();


router.post('/inviteadmin', inviteAdmin);
router.put('/signup', adminSignup);


module.exports = router;