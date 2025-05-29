const Issue = require('../models/issue.model');
const User = require('../models/user.model');
const cloudinary = require('../utils/cloudinary');

exports.createIssue = async (req, res) => {
    const { title, description, category, state, location, images} = req.body;
    const {_id} = req.query;
    const filePath = req.file.path;

    try {
        if (!title || !description || !category || !state || !location || !images) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        //find the user and attch the issue to the reporting user
        const userId = await User.findById({_id});

        const newIssue = new Issue({
            title,
            description,
            category,
            state,
            location: userId.state,
            images,
            reportedBy: userId.firstName
            
        });

        //if user reports anonymously, do not attach user to the issue. Show 'Anonymous'
        if (newIssue.isAnonymous == true) {
            newIssue.reportedBy = 'Anonymous';
        }

        // Upload images to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(filePath,
            { public_id: `image/${newIssue.category}_${newIssue._id}`,
              folder: 'FixitIssues'
        }); 

        newIssue.images = uploadResult.secure_url;

        await newIssue.save();

        // Update the user's myIssues tab
        await User.findByIdAndUpdate(userId, { $push: { myIssues: newIssue._id } });

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
            .populate('myIssues', 'title description category state location images reportdate status')
            .populate('comments', 'content createdAt')
            .populate('votes', 'userId voteType createdAt')

            .sort({ reportdate: -1 });
        res.status(200).json({ message: "Issues retrieved successfully", data: issues });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

