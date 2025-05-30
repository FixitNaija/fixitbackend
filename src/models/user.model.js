const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String},
    email: {type: String, unique: true, required: true},
    phone: {type: String, unique: true},
    password: {type: String, required: true},
    otp: {type: String, default: null},
    isVerified: {type: Boolean, default: false},
    state: {type: String},
    localGovernment: {type: String},
    neighborhood: {type: String},
    isNewsletterSubscribed: {type: Boolean, default: false},
    profileImage: {type: String, default: 'https://res.cloudinary.com/dwx1tdonc/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1748208985/default_icon_zynrhv.jpg'},
    myIssues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vote' }],

}, 

{timestamps: true}
);

module.exports = mongoose.model('User', UserSchema);