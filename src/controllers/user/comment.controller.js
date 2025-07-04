const Comment = require('../../models/user/comment.model');
const Issue = require('../../models/user/issue.model');
const User = require('../../models/user/user.model');


exports.createComment = async (req, res) => {
  const { author } = req.user.email
  const { content, isAnonymous } = req.body;
  const { issueID } = req.params;

  try {
    const user = await User.findOne({ email: author });
    const issue = await Issue.findOne({ issueID }); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const comment = new Comment({
      content,
      author,
      issue: issueID,
      isAnonymous,
      displayName: isAnonymous ? 'Anonymous' : user.firstName // Use the user's first name if not anonymous
    });

    await comment.save();
    issue.comments.push(comment._id);

    await issue.save();
    await User.findByIdAndUpdate(author, { $push: { comments: comment._id } });
    res.status(201).json({ message: 'Comment added successfully', comment });

  } catch (error) {
    console.log('Error creating comment:', error);
    res.status(500).json({ message: 'Server error while creating comment' });
  }
};


// Upvote a comment
exports.upvoteComment = async (req, res) => {
  const { user } = req.body.email;
  const { issueID } = req.params;

  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment.upvotes.includes(userId)) {
      comment.upvotes.push(userId);
      await comment.save();
      return res.json({ success: true, upvotes: comment.upvotes.length });
    }

    await User.findByIdAndUpdate(userId, {
  $addToSet: { votes: comment._id }
});


    res.status(400).json({ message: 'Already upvoted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Remove an upvote
exports.removeUpvote = async (req, res) => {
  const { user } = req.body.email;
  const { issueID } = req.params;

  try {
    const comment = await Comment.findById(req.params.id);
    comment.upvotes = comment.upvotes.filter(uid => uid.toString() !== userId);
    await comment.save();

    res.json({ success: true, upvotes: comment.upvotes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all comments for an issue
exports.getCommentsForIssue = async (req, res) => {
  const { issueID } = req.params;
  try {
    const comments = await Comment.find({ issue: issueID })
      .populate('author', 'firstName')
      .sort({ createdAt: -1 });

    const formatted = comments.map(comment => ({
      _id: comment._id,
      content: comment.content,
      displayName: comment.isAnonymous 
        ? 'Anonymous' 
        : (comment.author?.firstName || 'Unknown'),
      createdAt: comment.createdAt,
      isAnonymous: comment.isAnonymous
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single comment
exports.getComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

