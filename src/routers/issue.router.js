const express = require('express');
const router = express.Router();
const { createIssue, getIssues, myIssues } = require('../controllers/issue.controller');
const multer = require('multer');
const upload = require('../utils/multer'); 



router.post ('/report_issue', upload.array('images', 4), createIssue);
router.get('/all_issues', getIssues);
router.get('/profile/myissues', myIssues); 


module.exports = router;