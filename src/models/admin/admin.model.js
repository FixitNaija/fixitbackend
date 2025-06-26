const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    status: { type: String, enum: ['active', 'pending', 'deactivated'], default: 'pending' },
    inviteToken: { type: String},
    inviteExpires: { type: Date },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
    lastLogin: { type: Date, default: Date.now }
},

{timestamps: true}

);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;