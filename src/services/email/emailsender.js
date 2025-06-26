const transporter = require("../../utils/nodemailer");
const signupOTP = require("./templates/signupOTP");

const sendSignupOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: "ola.gabriel19@gmail.com",
      to: email,
      subject: "Verify Your Account",
      html: signupOTP(otp),
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
};
