const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

// Create a comment on an issue
router.post('/:issueId', commentController.createComment);

// Upvote a comment
router.post('/:id/upvote', commentController.upvoteComment);

// Remove upvote
router.post('/:id/unupvote', commentController.removeUpvote);

// Get all comments for a specific issue
router.get('/issue/:issueId', commentController.getCommentsForIssue);

module.exports = router;
