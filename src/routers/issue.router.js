const express = require('express');
const router = express.Router();
const { createIssue, getSingleIssue, getAllIssues, upvoteIssue } = require('../controllers/issue.controller');
const upload = require('../utils/multer'); 
const isAuthenticated = require('../middleware/isAuthenticated');



router.post('/reportissue', isAuthenticated, upload.array('images', 4), createIssue);
router.get('/allissues', getAllIssues);
router.post('/:issueID/upvote', isAuthenticated, upvoteIssue);
router.get('/:issueID', getSingleIssue);


module.exports = router;

