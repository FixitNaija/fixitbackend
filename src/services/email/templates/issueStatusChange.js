const IssueStatusChangeNotification = (firstName, issueID, status, title) => {
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Issue Status Update</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f7f7f7; margin: 0; padding: 0; }
    .container { max-width: 500px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 32px; }
    .footer { font-size: 0.9em; color: #888; margin-top: 32px; }
    .status { font-weight: bold; color: rgb(19, 162, 74); }
    .issue-info { margin: 16px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Issue Status Update</h2>
    <p>Hi ${firstName},</p>
    <p>The status of your reported issue has changed. Here are the details:</p>
    <div class="issue-info">
      <ul>
        <li><strong>Issue Title:</strong> ${title}</li>
        <li><strong>Issue ID:</strong> ${issueID}</li>
        <li><strong>New Status:</strong> <span class="status">${status}</span></li>
      </ul>
    </div>
    <p>Thank you for using Fixit Naija. We will keep you updated on further changes.</p>
    <div class="footer">
      &copy; ${currentYear} Fixit Naija. All rights reserved.
    </div>
  </div>
</body>
</html>`;
};

module.exports = IssueStatusChangeNotification;
