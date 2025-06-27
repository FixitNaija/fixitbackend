const signupOTP = (otp, verificationLink) => {
    const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Account</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f7f7f7; margin: 0; padding: 0; }
    .container { max-width: 400px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 32px; }
    .otp { font-size: 2em; letter-spacing: 8px; color: #2d7ff9; margin: 24px 0; }
    .footer { font-size: 0.9em; color: #888; margin-top: 32px; }
    .verify-link { display: inline-block; margin: 20px 0; padding: 12px 24px; background: #2d7ff9; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Welcome to FixIt Naija!</h2>
    <p>Thank you for signing up. To verify your account, please use the One-Time Password (OTP) below:</p>
    <div class="otp">${otp}</div>
    <p>Or click the button below to verify your account:</p>
    <a href="${verificationLink}" class="verify-link">Verify Account</a>
    <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
    <p>If you did not request this, please ignore this email.</p>
    <div class="footer">
      &copy; ${currentYear} FixIt. All rights reserved.
    </div>
  </div>
</body>
</html>`;
};

module.exports = signupOTP;