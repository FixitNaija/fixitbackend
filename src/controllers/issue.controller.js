const Upvote = require('../models/upvotes.model');
const Issue = require('../models/issue.model');
const User = require('../models/user.model');
const cloudinary = require('../utils/cloudinary');
const path = require('path');
const genID = require('../utils/nanoid'); 
const { sendNewIssueNotification } = require('../services/email/emailsender');
const { createIssueSchema } = require('../validations/validate');

exports.createIssue = async (req, res) => {
    const { title, description, category, state, location } = req.body;
    const userID = req.user.id; 
    const images = req.files;

   

    try {
        if (!title || !description || !category || !state || !location) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }


        //Validate user input
        const { error } = createIssueSchema.validate(req.body);
            if (error) {
            return res.status(400).json({ message: error.details[0].message });
            }

        // Find the user and attach the issue to the reporting user
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

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

        const issueID = genID(); 

        const newIssue = new Issue({
            issueID : issueID,
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
            return res.status(403).json({ message: "Please upload at least one image" });
        }
        if(newIssue.images.length > 4) {
            return res.status(403).json({ message: "You can only upload a maximum of 4 images" });
        }

        await newIssue.save();

        // Update the user's myIssues tab
        await User.findByIdAndUpdate(user._id, { $push: { myIssues: newIssue._id } });

        // Send email notification to the user
        await sendNewIssueNotification(user.email, user.firstName, newIssue);

        res.status(201).json({ message: "Report created successfully", data: newIssue });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}; 

exports.getSingleIssue = async (req, res) => {
    const {issueID} = req.params;
    try {
        const issue = await Issue.findOne({issueID})
            .populate('comments', 'author content upvotes createdAt') 

        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        res.status(200).json({ message: "Issue retrieved successfully", data: issue });
    } catch (error) {
        console.log(error);
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
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};


exports.upvoteIssue = async (req, res) => {
    const {issueID} = req.params;
    const userID  = req.user.id; 

    try {
        const validIssue = await Issue.find({issueID});
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
            await Issue.findByIdAndUpdate(validIssue._id, { $push: { upvotes: upvote._id } });
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







