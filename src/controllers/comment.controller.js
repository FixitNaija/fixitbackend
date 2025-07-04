const Comment = require('../models/comment.model');
const Issue = require('../models/issue.model');
const User = require('../models/user.model');

// Create a comment
exports.createComment = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { content, isAnonymous } = req.body;
    const { issueID } = req.params;

    if (!issueID) {
      return res.status(400).json({ message: "Issue ID parameter is missing from the URL." });
    }

    const issue = await Issue.findOne({ issueID });
    console.log("ISSUE FOUND:", issue);

    if (!issue) {
      return res.status(404).json({ message: `No issue found with issueID: ${issueID}` });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const comment = new Comment({
      content,
      author: user._id,
      issue: issue._id,
      isAnonymous,
      displayName: isAnonymous ? "Anonymous" : user.firstName
    });

    await comment.save();

    issue.comments.push(comment._id);
    await issue.save();

    await User.findByIdAndUpdate(
      user._id,
      { $push: { comments: comment._id } }
    );

    const populatedComment = await Comment.findById(comment._id).populate({
      path: 'issue',
      select: 'issueID title'
    });

    return res.status(201).json({
      message: "Comment created successfully.",
      comment: populatedComment
    });

  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({
      message: "Server error while creating comment.",
      error: error.message
    });
  }
};


//  Upvote a comment
exports.upvoteComment = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    if (!comment.upvotes.includes(user._id)) {
      comment.upvotes.push(user._id);
      await comment.save();

      await User.findByIdAndUpdate(user._id, {
        $addToSet: { votes: comment._id }
      });

      return res.json({
        success: true,
        upvotes: comment.upvotes.length
      });
    }

    return res.status(400).json({ message: 'Already upvoted' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

//  Remove an upvote
exports.removeUpvote = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    comment.upvotes = comment.upvotes.filter(
      uid => uid.toString() !== user._id.toString()
    );
    await comment.save();

    res.json({
      success: true,
      upvotes: comment.upvotes.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

//  Get all comments for an issue
exports.getCommentsForIssue = async (req, res) => {
  try {
    const { issueID } = req.params;

    const issue = await Issue.findOne({ issueID });
    if (!issue) {
      return res.status(404).json({ message: `No issue found with issueID: ${issueID}` });
    }

    const comments = await Comment.find({ issue: issue._id })
      .populate('author', 'firstName')
      .sort({ createdAt: -1 });

    const formatted = comments.map(comment => ({
      _id: comment._id,
      content: comment.content,
      displayName: comment.isAnonymous
        ? 'Anonymous'
        : (comment.author?.firstName || 'Unknown'),
      createdAt: comment.createdAt,
      isAnonymous: comment.isAnonymous,
      upvotes: comment.upvotes.length
    }));

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

//  Update a comment
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      req.body,
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    res.json(comment);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//  Get a single comment
exports.getComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    res.json(comment);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//  Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    res.json({ message: 'Comment deleted successfully.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
