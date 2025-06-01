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

        await newIssue.save();

        // Update the user's myIssues tab
        await User.findByIdAndUpdate(user._id, { $push: { myIssues: newIssue._id } });

        res.status(201).json({ message: "Report created successfully", data: newIssue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}; 

exports.getIssues = async (req, res) => {
    try {
        const issues = await Issue.find()
            .populate('reportedBy', 'firstName location reportdate status')
            .populate('comments', 'userId content createdAt')
            .populate('votes', 'userId voteType createdAt')

            .sort({ reportdate: -1 });
        res.status(200).json({ message: "Issues retrieved successfully", data: issues });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};


exports.myIssues = async (req, res) => {
    const userId = req.query.id; 
    try {
        const issues = await Issue.find({ reportedBy: userId })
                                  .populate('myIssues', 'title description category state location images reportdate status')
                                  .sort({ reportdate: -1 });
        res.status(200).json({ message: "Issues retrieved successfully", data: issues });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};



