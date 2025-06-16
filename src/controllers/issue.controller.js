const Upvote = require('../models/upvotes.model');
const Issue = require('../models/issue.model');
const User = require('../models/user.model');
const cloudinary = require('../utils/cloudinary');
const path = require('path');

exports.createIssue = async (req, res) => {
    const { title, description, category, state, location } = req.body;
    const id = req.query.id;
    const images = req.files;

    try {
        if (!title || !description || !category || !state || !location) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        // Find the user and attach the issue to the reporting user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(req.body);
        console.log(user);

        // Upload multiple images to Cloudinary
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uploadResult = await cloudinary.uploader.upload(file.path, {
                    folder: 'FixitIssues'
                });
                imageUrls.push(uploadResult.secure_url);
            }
        }

        const newIssue = new Issue({
            title,
            description,
            category,
            state,
            location,
            images: imageUrls,
            reportedBy: user._id,
            reportedByName: user.firstName,
        });

        // If user reports anonymously, do not attach user to the issue. Show 'Anonymous'
        if (newIssue.isAnonymous === true) {
            newIssue.reportedByName = 'Anonymous';
        }

        if(newIssue.images.length === 0) {
            return res.status(400).json({ message: "Please upload at least one image" });
        }

        await newIssue.save();

        // Update the user's myIssues tab
        await User.findByIdAndUpdate(user._id, { $push: { myIssues: newIssue._id } });

        res.status(201).json({ message: "Report created successfully", data: newIssue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}; 

exports.getSingleIssue = async (req, res) => {
    const id = req.query.id;
    try {
        const issue = await Issue.findById(id)
            .populate('comments', 'author content upvotes createdAt')

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        res.status(200).json({ message: "Issue retrieved successfully", data: issue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};


exports.myIssues = async (req, res) => {
    const id = req.query.id; 
    try {
        const issues = await Issue.find({ reportedBy: id })
                                  .sort({ reportdate: -1 });
        res.status(200).json({ message: "Issues retrieved successfully", data: issues });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};


exports.getAllIssues = async (req, res) => {
    try {
        const issues = await Issue.find()
                                  .sort({ reportdate: -1 })
                                  .populate('reportedBy', 'firstName')
                                  .populate('comments', 'author content upvotes createdAt');

        res.status(200).json({ message: "All issues retrieved successfully", data: issues });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.upvoteIssue = async (req, res) => {
    const {issueID, userID}  = req.query;

    try {
        const validIssue = await Issue.findById(issueID);
        if (!validIssue) {
            return res.status(404).json({ message: "Issue not found" });
        }
             if (!userID) {
            return res.status(400).json({ message: "Login to upvote this issue" });
              }
        let upvote = await Upvote.findOne({ issue: issueID });
        if (!upvote) {
            // If no upvote document exists for this issue, create a new one
            upvote = new Upvote({ issue: issueID, whoUpvoted: [userID] });
            await upvote.save();
            await Issue.findByIdAndUpdate(issueID, { $push: { upvotes: upvote._id } });
            return res.status(200).json({ message: 'Upvoted successfully' });
        }

        // Check if user already upvoted
        if (upvote.whoUpvoted.includes(userID)) {
            return res.status(400).json({ message: "You have already upvoted this issue" });
        }

        // Add user to whoUpvoted and save
        upvote.whoUpvoted.push(userID);
        await upvote.save();

        res.status(200).json({ message: 'Upvoted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};





