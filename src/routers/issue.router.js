const express = require('express');
const router = express.Router();
const { createIssue, getIssues, myIssues } = require('../controllers/issue.controller');
const multer = require('../utils/multer');



router.post ('/report_issue', multer.array('images', 4), createIssue);
router.get('/all_issues', getIssues);
router.get('/profile/myissues', myIssues); 


module.exports = router;