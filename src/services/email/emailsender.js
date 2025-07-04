const transporter = require("../../utils/nodemailer");
const signupOTP = require("./templates/signupOTP");
const passwordResetOTP = require("./templates/passwordReset"); 
const NewIssueNotification = require("./templates/newIssue");
const IssueStatusChangeNotification = require("./templates/issueStatusChange");

const sendSignupOTP = async (email, otp, verificationLink) => {
  try {
    const mailOptions = {
      from: "fixitteam300@gmail.com",
      to: email,
      subject: "Verify Your Account",
      html: signupOTP(otp, verificationLink),
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`${new Date().toLocaleString()} - Email sent successfully:` + info.response);
  } catch (error) {
    console.log("Email error:", error);
    throw new Error("Couldn't send Mail.");
  }
};

const sendPasswordResetOTP = async (email, otp, passwordResetLink) => {
  try {
    const mailOptions = {
      from: "fixitteam300@gmail.com",
      to: email,
      subject: "Password Reset",
      html: passwordResetOTP(otp, passwordResetLink),
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`${new Date().toLocaleString()} - Email sent successfully:` + info.response);
  } catch (error) {
    console.log("Email error:", error);
    throw new Error("Couldn't send Mail.");
  }
};


const sendNewIssueNotification = async (email, firstName, NewIssue) => {
  try {
    const mailOptions = {
      from: "fixitteam300@gmail.com",
      to: email,
      subject: "New Issue Reported",
      html: NewIssueNotification(firstName, NewIssue),
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`${new Date().toLocaleString()} - Email sent successfully:` + info.response);
  } catch (error) {
    console.log("Email error:", error);
    throw new Error("Couldn't send Mail.");
  }
};

const sendIssueStatusChangeNotification = async (firstName, email, issueID, status) => {
  try {
    const mailOptions = {
      from: "fixitteam300@gmail.com",
      to: email,
      subject: "Issue Status Update",
      html: IssueStatusChangeNotification(firstName, issueID, status, title),
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`${new Date().toLocaleString()} - Email sent successfully:` + info.response);
  } catch (error) {
    console.log("Email error:", error);
    throw new Error("Couldn't send Mail.");
  }
};


module.exports = {
  sendSignupOTP,
  sendPasswordResetOTP,
  sendNewIssueNotification,
  sendIssueStatusChangeNotification
};
