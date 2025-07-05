const User = require('../../models/user/user.model');
const Issue = require('../../models/user/issue.model');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../../utils/hashing');
const { sendSignupOTP, sendPasswordResetOTP } = require('../../services/email/emailsender');
const { userSignupSchema, userLoginSchema, passwordResetSchema } = require('../../validations/validate');


exports.userSignup = async (req, res) => {
    const {firstName, lastName, email, password, state, localGovernment, neighborhood, isNewsletterSubscribed} = req.body; 
    try{
        if(!firstName || !lastName || !email ||!password){
            return res.status(400).json({message: "Input your Signup Credentials"})
        }

        // Validate user input
        const { error } = userSignupSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const existingUser = await User.findOne({email})
         if(existingUser){
            return res.status(403).json({message: "User already exists, please login"})
            }


        const hashedPassword = await hashPassword(password);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({
            firstName,
            lastName, 
            email,
            state,
            localGovernment,
            neighborhood,
            isNewsletterSubscribed,
            otp,
            password: hashedPassword
        });

        await newUser.save(); 

        // Send OTP and verification link to user's email
        const verificationLink = `https://fixitbackend-7zrf.onrender.com/api/v1/user/verify?email=${newUser.email}`;
        await sendSignupOTP(newUser.email, otp, verificationLink); 

        return res.status(201)
        .json({message: "Account created successfully, Check your email for OTP and verify your account", 
             data: firstName, email, otp,
             redirectLink: `https://fixitbackend-7zrf.onrender.com/api/v1/user/verify?email=${newUser.email}`}); 
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
            return res.status(400).json({message: "Check your email for verification link"})
        }

        if(!otp){
            return res.status(400).json({message: "Check your email for OTP and Input your OTP"})
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

exports.resendOTP = async (req, res) => {
  const { email } = req.query;

  try {
    if (!email) {
      return res.status(400).json({ message: "Input your Email" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(403).json({ message: "Input a valid Email" });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    existingUser.otp = otp;
    await existingUser.save();

    // Send new OTP to user's email
    const verificationLink = `https://fixitbackend-7zrf.onrender.com/api/v1/user/verify?email=${existingUser.email}`;
    await sendSignupOTP(existingUser.email, otp, verificationLink);

    return res.status(200).json({
      message: "New OTP sent to your email",
      redirectLink: `https://fixitbackend-7zrf.onrender.com/api/v1/user/verify?email=${existingUser.email}`,
      otp: otp
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Input your Login Credentials" });
    }

    // Validate user input
    const { error } = userLoginSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(403).json({ message: "Please Create an Account" });
    }


    const isMatch = await comparePassword(password, existingUser.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid Credentials" });
    }

    if (existingUser.isVerified === false) {
      return res.status(403).json({ message: "Account not Verified, Check email for OTP" });
    }

    const token = jwt.sign({
      user: {id: existingUser._id, name: existingUser.firstName, email: existingUser.email}
  }, process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRATION_USER }
);

    res.status(200).json({message: "Logged in Successfully",
       token: token,
       user: {name: existingUser.firstName, email: existingUser.email}
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" }); 
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
        const passwordResetLink = `https://fixitbackend-7zrf.onrender.com/api/v1/user/resetpassword?email=${existingUser.email}`;
        await sendPasswordResetOTP(existingUser.email, otp, passwordResetLink);

        return res.status(200).json({message: "OTP sent to your email",
                redirectLink: `https://fixitbackend-7zrf.onrender.com/api/v1/user/resetpassword?email=${existingUser.email}`,
                otp: otp });
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

        // Validate password reset input
        const { error } = passwordResetSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
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

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      'firstName lastName email phone state localGovernment neighborhood profileImage'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile fetched successfully',
      data: user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


exports.myIssues = async (req, res) => { //now routed in the user router
    const userID = req.user.id;
    try {
        const issues = await Issue.find({ reportedBy: userID })
                                  .sort({ reportDate: -1 });
        console.log({reportedBy: userID});
        res.status(200).json({ message: "Issues retrieved successfully", data: issues });
    } catch (error) {
        console.log(error); 
        res.status(500).json({ message: "Server Error" }); 
    }
}; 

exports.getDashboardMetrics = async (req, res) => {
  try {
    const userID = req.user.id;

    // 1. Active issues (not resolved)
    const activeIssues = await Issue.countDocuments({
      reportedBy: userID,
      status: { $ne: 'Resolved' }
    });

    // 2. Resolved this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const resolvedThisWeek = await Issue.countDocuments({
      reportedBy: userID,
      status: 'Resolved',
      updatedAt: { $gte: oneWeekAgo }
    });

    // 3. Average response time (in days)
    const resolvedIssues = await Issue.find({
      reportedBy: userID,
      status: 'Resolved'
    });

    let totalDays = 0;
    resolvedIssues.forEach(issue => {
      const created = issue.createdAt;
      const resolved = issue.updatedAt;
      const days = (resolved - created) / (1000 * 60 * 60 * 24);
      totalDays += days;
    });

    const avgResponseTime = resolvedIssues.length > 0
      ? Math.round(totalDays / resolvedIssues.length)
      : 0;

    // 4. Community engagement = total upvotes + total comments
    const userIssues = await Issue.find({ reportedBy: userId });

    let totalUpvotes = 0;
    let totalComments = 0;

    userIssues.forEach(issue => {
      totalUpvotes += issue.upvotes.length;
      totalComments += issue.comments.length;
    });

    const communityEngagement = totalUpvotes + totalComments;

    return res.status(200).json({
      message: 'Dashboard metrics fetched successfully',
      data: {
        activeIssues,
        resolvedThisWeek,
        avgResponseTime,
        communityEngagement
      }
    });
  } catch (err) {
    console.error('Dashboard Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};


