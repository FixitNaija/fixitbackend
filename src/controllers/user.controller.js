const User = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/hashing');


exports.userSignup = async (req, res) => {
    const {firstName, lastName, phone, email, password} = req.body; 
    try{
        if(!firstName || !lastName || !phone || !email ||!password){
            return res.status(400).json({message: "Input your Signup Credentials"})
        }

        const existingUser = await User.findOne({email})
         if(existingUser){
            return res.status(403).json({message: "User already exists, please login"})
            }


        const hashedPassword = await hashPassword(password);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({
            phone, 
            email,
            otp,
            password: hashedPassword
        });

        // Send OTP to user's email
        // await sendEmail(newUser.email, "OTP Verification", `Your OTP is ${otp}`);

        await newUser.save();
        return res
        .status(201)
        .json({message: "Account created successfully, Check your email for OTP verification", 
            data: firstName, email})
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }
}; 

exports.verifyUser = async (req, res) => {
    const {email} = req.query; 
    const {otp} = req.body;
    try{
        if(!email){
            return res.status(400).json({message: "Click the verification link sent to your email"})
        }

        if(!otp){
            return res.status(400).json({message: "Input your OTP"})
        }

        const existingUser = await User.findOne({email})

        if(!existingUser){
            return res.status(403).json({message: "User not found"})
        }

        if(existingUser.otp !== otp){
            return res.status(403).json({message: "Invalid OTP"})
        }

        existingUser.isVerified = true;
        existingUser.otp = null; // Clear OTP after verification
        await existingUser.save();

        return res.status(200).json({message: "Email verified successfully"})
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }
};


exports.userLogin = async (req, res) => {
    const {phone, email, password} = req.body; 
    try{
        if(!phone || !email ||!password){
            return res.status(400).json({message: "Input your Login Credentials"})
        }

        const existingUser = await User.findOne({email})
         if(!existingUser){
            return res.status(403).json({message: "Please Create an Account"})
            }

        const isMatch = await comparePassword(password, existingUser.password);
        if(!isMatch){
            return res.status(403).json({message: "Invalid Credentials"})
        }

        return res.status(200).json({message: "Logged in Successfully", data: phone, email})
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }
};

exports.forgotPassword = async (req, res) => {
    const {email} = req.body; 
    try{
        if(!email){
            return res.status(400).json({message: "Input your Email"})
            }

        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(403).json({message: "Input a valid Email"})
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        existingUser.otp = otp;
        await existingUser.save();

        // Send OTP to user's email
        // await sendEmail(existingUser.email, "Password Reset OTP", `Your OTP is ${otp}`);

        return res.status(200).json({message: "OTP sent to your email"})
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }
};

exports.resetPassword = async (req, res) => {
    const {otp, newPassword} = req.body; 
    const {email} = req.query; 
    try{
        if(!otp || !newPassword){
            return res.status(400).json({message: "Input your OTP and New Password"})
        }

        const verifyUser = await User.findOne({email})

        if(verifyUser.otp !== otp){
            return res.status(403).json({message: "Invalid OTP"})
        }

        const hashedPassword = await hashPassword(newPassword);
        verifyUser.password = hashedPassword;
        verifyUser.otp = null; // Clear OTP
        await verifyUser.save();

        return res.status(200).json({message: "Password reset successfully"})
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }
}; 


