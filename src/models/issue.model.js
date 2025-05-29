const mongoose = require('mongoose'); 

const issueSchema = new mongoose.Schema({
    title: {type: string, required: true},
    description: {type: string, required: true}, 
    category: { type: string, enum: ['Road Damage', 'Clogged Drainage', 'Streetlight Issue'], 
                required: true },  
    location: {type: string, required: true},
    images: {type: string, required: true},
    status: {type: string, enum: ['Reported', 'Acknowledged','In Progress', 'Resolved'], default: 'Open'},
    reportdate: { type: Date, default: Date.now },
    reportedBy: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    isAnonymous: {type: Boolean, default: false},
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vote' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
},

    {timestamps: true} 
); 

module.exports = mongoose.model('Issue', issueSchema); 