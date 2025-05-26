const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String, unique: true},
    phone: {type: String, unique: true},
    password: {type: String, required: true},
    state: {type: String},
    local_government: {type: String},
    neighborhood: {type: String},
    profile_image: {type: String, default: 'https://res.cloudinary.com/dwx1tdonc/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1748208985/default_icon_zynrhv.jpg'},
    issues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Issue' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vote' }],

}, 

{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);