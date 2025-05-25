const User = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/hashing');


exports.usersignup = async (req, res) => {
    const {phone, email, password} = req.body; 
    try{
        if(!phone || !email ||!password){
            return res.status(400).json({message: "Input your Signup Credentials"})
        }

        const existingUser = await User.findOne({email})
         if(existingUser){
            return res.status(403).json({message: "User already exists, please login"})
            }

        const existingPhone = await User.findOne({phone})
        if(existingPhone){
            return res.status(403).json({message: "User already exists, please login"})
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User({
            phone, 
            email,
            password: hashedPassword
        });

        await newUser.save();
        return res.status(201).json({message: "Signed up Successfully", data: phone, email})
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Server Error"})
    }
}; 


exports.userlogin = async (req, res) => {
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

