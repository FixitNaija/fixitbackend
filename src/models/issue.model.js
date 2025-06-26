const mongoose = require('mongoose'); 

const issueSchema = new mongoose.Schema({
    issueID: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    description: {type: String, required: true}, 
    category: { type: String, enum: ['Road Damage', 'Clogged Drainage', 'Streetlight Issue'], 
                required: true },  
    location: {type: String, required: true},
    images: {type: String, required: true},
    status: {type: String, enum: ['Reported', 'Acknowledged','In Progress', 'Resolved'], default: 'Open'},
    reportDate: {type: Date, default: Date.now},
    reportedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    upvotes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Upvote'}]
},

    {timestamps: true} 
); 

module.exports = mongoose.model('Issue', issueSchema); 