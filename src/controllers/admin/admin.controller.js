const Admin = require('../../models/admin.model');
const { hashPassword, comparePassword } = require('../../utils/hashing');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');



exports.inviteAdmin = async (req, res) => {
    const { firstName, email } = req.body;
    //const id = req.query.id; 
    try {
        if (!firstName || !email) {
            return res.status(400).json({ message: 'FirstName and email are required' });
        }

        //if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    //         return res.status(400).json({ message: 'Invalid or missing superadmin ID' });
    //     }

    //    const superadmin = await Admin.findById(id); 
    //     if (!superadmin) {
    //         return res.status(404).json({ message: 'Only superadmins can invite new admins' });
    //     }

        //Superadmin ID in the env file
       // if (id !== process.env.SUPERADMIN_ID) {
        //   return res.status(403).json({ message: 'You are not authorized to invite admins' });
        //}

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' }); 
    }

        // Create signup token to encrypt email and firstName 
        const signupToken = jwt.sign({ email, firstName }, process.env.SECRET_KEY,{ expiresIn: '1hr' }); 
    
        //generate signuplink 
        const signupLink = `http://localhost:${process.env.PORT}/api/v1/admin/signup/${signupToken}`;

    
        const invitedAdmin = new Admin({
            firstName,
            email,
            status: 'pending',
            inviteToken: signupToken,
            inviteExpires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
        });
        
        await invitedAdmin.save();

        // Send response with signup link
        return res.status(200).json({ message: 'Invite link generated successfully', signupLink, expiresIn: '1 hour' }); 

    } catch (error) {
        console.error('Invite admin error:', error);
        return res.status(500).json({ message: 'Failed to generate invite link' });
    }
}; 

exports.adminSignup = async (req, res) => {
    const { password } = req.body;
    //const adminInfo = req.headers.authorization;
    const adminInfo = req.params.token; 
console.log(adminInfo);

    try {
        // Verify token from header
        if (!adminInfo) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = adminInfo.split(' ')[1]; 
        const decoded = jwt.verify(adminInfo, process.env.SECRET_KEY);
        const { email } = decoded;

        // Find invited admin
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

        // Hash password and update admin
        const hashedPassword = await bcrypt.hash(password, 10);
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
        
        console.error('Admin signup error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
};


exports.Adminlogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find the admin by email
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

        // Generate JWT token
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Failed to log in' });
    }
}