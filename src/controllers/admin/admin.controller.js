const Admin = require('../../models/admin/admin.model');
const Issue = require('../../models/user/issue.model'); 
const User = require('../../models/user/user.model');
const { sendIssueStatusChangeNotification } = require('../../services/email/emailsender');
const { hashPassword, comparePassword } = require('../../utils/hashing');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { adminSignupSchema } = require('../../validations/validate'); 



exports.inviteAdmin = async (req, res) => {
    const { firstName, email } = req.body;
    const adminID = req.admin.id; 
    try {

        const validAdmin = await Admin.findById(adminID);
        if (!validAdmin || validAdmin.role !== 'superadmin') {
            return res.status(403).json({ message: 'You are not authorized to invite admins' });
        }
        if (!firstName || !email) {
            return res.status(400).json({ message: 'FirstName and email are required' });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(403).json({ message: 'Admin with this email already exists' }); 
    }

        
        const signupToken = jwt.sign({ email, firstName }, process.env.JWT_SECRET,{ expiresIn: '1hr' });  
        const signupLink = `https://fixitbackend-7zrf.onrender.com/api/v1/admin/signup/${signupToken}`;

    
        const invitedAdmin = new Admin({
            firstName,
            email,
            status: 'pending',
            inviteToken: signupToken,
            inviteExpires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        });
        
        await invitedAdmin.save();

        return res.status(200).json({ message: 'Invite link generated successfully', signupLink, expiresIn: '1 hour' }); 

    } catch (error) {
        console.log('Invite admin error:', error);
        return res.status(500).json({ message: 'Failed to generate invite link' });
    }
}; 

exports.adminSignup = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded;

        const invitedAdmin = await Admin.findOne({
            email,
            status: 'pending',
            inviteExpires: { $gt: new Date() }
        });

        if (!invitedAdmin) {
            return res.status(404).json({ 
                message: 'Invalid or expired invite. Contact SuperAdmin for a new invite.' 
            });
        }

        // Validate admin signup input
        const { error } = adminSignupSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const hashedPassword = await hashPassword(password);
        invitedAdmin.password = hashedPassword;
        invitedAdmin.status = 'active';
        invitedAdmin.inviteToken = undefined;
        invitedAdmin.inviteExpires = undefined;

        await invitedAdmin.save();

        return res.status(201).json({
            message: 'Admin signup successful',
            data: {
                name: invitedAdmin.name,
                email: invitedAdmin.email
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const admin = await Admin.findOne({ email }); 
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Check if the admin is active
        if (admin.status !== 'active') {
            return res.status(403).json({ message: 'Admin account is not active' });
        }

        // Compare the password
        const isMatch = await comparePassword(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ user: { id: admin._id, email: admin.email, role: admin.role } }, process.env.JWT_SECRET,
             { expiresIn: process.env.JWT_EXPIRATION_ADMIN });

        return res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        console.log('Login error:', error);
        return res.status(500).json({ message: 'Failed to log in' });
    }
};

exports.adminDashboard = async (req, res) => {
    const adminID = req.user.id;
    try {
        const validAdmin = await Admin.findById(adminID);
        if (!validAdmin) {
            return res.status(403).json({ message: "You are not authorized to access this dashboard" });
        }

        const issues = await Issue.find().populate('reportedBy', 'firstName lastName'); 
        return res.status(200).json({ message: 'Issues retrieved successfully', data: issues });
    } catch (error) {
        console.log('Error retrieving issues:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

exports.adminChangeStatus = async (req, res) => {
    const { issueID } = req.params;
    const { status } = req.body; 
    const adminID = req.user.id;
    try {
        const validAdmin = await Admin.findById(adminID);
        if (!validAdmin) {
            return res.status(403).json({ message: "You are not authorized to change issue status" });
        }
        const issue = await Issue.findOne({ issueID });
        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        if(status == undefined || status == null || status == " "){
            return res.status(403).json({message: "Update status before you save"})
        }

        issue.status = status;
        await issue.save();

        //send email to notify user of issue change
        const user = await User.findById(issue.reportedBy);
        if (user) {
            await sendIssueStatusChangeNotification(user.firstName, user.email, issue.issueID, status, issue.title);
        }

        res.status(200).json({ message: "Issue Status Changed successfully", data: issue });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

