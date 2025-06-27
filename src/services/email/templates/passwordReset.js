const passwordResetOTP = (otp, passwordResetLink) => {
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Password Reset Request</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f7f7f7; margin: 0; padding: 0; }
    .container { max-width: 400px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 32px; }
    .otp { font-size: 2em; letter-spacing: 8px; color:rgb(13, 152, 71); margin: 24px 0; }
    .footer { font-size: 0.9em; color: #888; margin-top: 32px; }
    .reset-link { display: inline-block; margin: 20px 0; padding: 12px 24px; background:rgb(17, 176, 70); color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Reset Request</h2>
    <p>We received a request to reset your password for your Fixit Naija account.</p>
    <p>Please use the One-Time Password (OTP) below to reset your password:</p>
    <div class="otp">${otp}</div>
    <p>Or click the button below to reset your password:</p>
    <a href="${passwordResetLink}" class="reset-link">Reset Password</a>
    <p>This OTP is valid for the next 10 minutes. If you did not request a password reset, please ignore this email.</p>
    <div class="footer">
      &copy; ${currentYear} Fixit Naija. All rights reserved.
    </div>
  </div>
</body>
</html>`;
};

module.exports = passwordResetOTP;