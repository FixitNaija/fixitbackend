const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/user/comment.controller');


router.post('/', commentController.createComment); // Create a comment on an issue
router.get('/', commentController.getCommentsForIssue); // Get all comments for a specific issue

// Get/Update/Delete specific comment by ID
router.post('/:id', commentController.updateComment);
router.get('/:id', commentController.getComment);
router.delete('/:id', commentController.deleteComment);

// Upvote a comment
router.post('/:id/upvote', commentController.upvoteComment);

// Remove upvote
router.post('/:id/unupvote', commentController.removeUpvote);



module.exports = router;