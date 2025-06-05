const Admin = require('../../models/admin.model');
const { hashPassword, comparePassword } = require('../../utils/hashing');
const jwt = require('jsonwebtoken');



exports.inviteAdmin = async (req, res) => {
    const { name, email } = req.body;
    const { _id } = req.query; 
    try {
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        //Retrieve the superadmin from the database but adds more speed and security by checking ENV 
       const superadmin = await Admin.findById(_id);
        if (!superadmin) {
            return res.status(404).json({ message: 'Superadmin not found' });
        }
        if (superadmin.role !== "superadmin") {
            return res.status(403).json({ message: 'Only superadmins can invite new admins' });
        }

        //Superadmin ID in the env file
       // if (id !== process.env.SUPERADMIN_ID) {
        //   return res.status(403).json({ message: 'You are not authorized to invite admins' });
        //}

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email already exists' });
    }

        // Create signup token to encrypt email and name
        const signupToken = jwt.sign({ email, name }, process.env.SECRET_KEY,{ expiresIn: '1hr' });
    
        //generate signuplink 
        const signupLink = `http://localhost:${process.env.PORT}/api/v1/admin/signup/${signupToken}`;

    
        const invitedAdmin = new Admin({
            name,
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
    const { token } = req.query;
    const { password } = req.body;

    try {
        if (!token || !password) {
            return res.status(400).json({ message: 'Token and password are required' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const { email, name } = decoded;

        // Validate invite token and if not expired
        const invitedAdmin = await Admin.findOne({
            email,
            inviteToken: token,
            inviteExpires: { $gt: new Date() }
        });

        if (!invitedAdmin) {
            return res.status(400).json({ message: 'Invalid or expired invite link' });
        }

    
        const hashedPassword = await hashPassword(password);

        invitedAdmin.password = hashedPassword;
        invitedAdmin.status = 'active';
        invitedAdmin.inviteToken = null; 
        invitedAdmin.inviteExpires = null; 

        await invitedAdmin.save();

        return res.status(200).json({ message: 'Signup successful, you can now log in' });

    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ message: 'Failed to complete signup' });
    }
}

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