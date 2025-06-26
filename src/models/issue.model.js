const mongoose = require('mongoose'); 

const issueSchema = new mongoose.Schema({
    issueID: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    description: {type: String, required: true}, 
    category: { type: String, enum: ['Road Damage', 'Clogged Drainage', 'Streetlight Issue'], 
                required: true },  
    location: {type: string, required: true},
    images: {type: string, required: true},
    status: {type: string, enum: ['Reported', 'Acknowledged','In Progress', 'Resolved'], default: 'Open'},
    reportdate: Date.now , 
    reportby: [{type: mongoose.Schema.Types.ObjectId, ref: 'firstName'}], 
},

    {timestamps: true} 
); 

module.exports = mongoose.model('Issue', issueSchema); 