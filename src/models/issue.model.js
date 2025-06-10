const mongoose = require('mongoose'); 

const issueSchema = new mongoose.Schema({
    title: {type: string, required: true},
    description: {type: string, required: true}, 
    category: { type: string, enum: ['Road Damage', 'Clogged Drainage', 'Streetlight Issue'], 
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