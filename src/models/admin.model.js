const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['active', 'pending', 'deactivated'], default: 'pending' },
    inviteToken: { type: String, unique: true },
    inviteExpires: { type: Date },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;