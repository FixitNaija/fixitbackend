const mongoose = require('mongoose'); 

const issueSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true}, 
    category: { type: String, enum: ['Road Damage', 'Clogged Drainage', 'Streetlight Issue'], 
                required: true },  
    location: {type: String, required: true},
    images: [{type: String, required: true}],
    status: {type: String, enum: ['Reported', 'Acknowledged','In Progress', 'Resolved'],
             default: 'Reported'},
    reportdate: { type: Date, default: Date.now },
    reportedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    reportedByName: {type: String},
    state: {type: String},
    isAnonymous: {type: Boolean, default: false},
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'upVote' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
},
     
    {timestamps: true} 
); 

module.exports = mongoose.model('Issue', issueSchema); 