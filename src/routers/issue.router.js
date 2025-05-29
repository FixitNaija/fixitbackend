const express = require('express');
const { createIssue } = require('../controllers/issue.controller');
const router = express.Router();
const multer = require('../utils/multer');
const upload = multer({ dest: 'uploads/' });


router.post ('/report_issue', upload.array('images', 4), createIssue);


module.exports = router;