const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/user/comment.controller');
const authenticate = require('../middleware/isAuthenticated');

router.use(authenticate);


router.post('/:issueID/comments', commentController.createComment); // Create a comment on an issue
router.get('/:issueID/comments', commentController.getCommentsForIssue); // Get all comments for a specific issue

// Get/Update/Delete specific comment by ID
router.put('/comments/:commentId', commentController.updateComment);
router.get('/comments/:commentId', commentController.getComment);
router.delete('/comments/:commentId', commentController.deleteComment);

// Upvote a comment
router.post('/comments/:commentId/upvote', commentController.upvoteComment);

// Remove upvote
router.delete('/comments/:commentId/upvote', commentController.removeUpvote);



module.exports = router;