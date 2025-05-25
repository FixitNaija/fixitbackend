const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String, unique: true},
    phone: {type: String, unique: true},
    password: {type: String, required: true},
    state: {type: String},
    local_government: {type: String},
    area: {type: String}
}, 

{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);