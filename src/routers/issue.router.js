const express = require('express');
const router = express.Router();
const { createIssue, myIssues, getSingleIssue, getAllIssues, upvoteIssue } = require('../controllers/issue.controller');
const multer = require('multer');
const upload = require('../utils/multer'); 



router.post ('/report_issue', upload.array('images', 4), createIssue);
router.get('/findissue', getSingleIssue);
router.get('/profile/myissues', myIssues); 
router.get('/allissues', getAllIssues);
router.post('/upvote', upvoteIssue);

module.exports = router;

