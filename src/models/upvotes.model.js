const mongoose = require('mongoose');

const UpvoteSchema = new mongoose.Schema({
    issue: {type: mongoose.Schema.Types.ObjectId, ref: 'Issue'},
    whoUpvoted: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});


module.exports = mongoose.model('upVote', UpvoteSchema);