const NewIssueNotification = (NewIssue) => {
  const { title, description, category, state, location, status, images = [] } = NewIssue;
  const currentYear = new Date().getFullYear();

  // Generate image HTML
  const imagesHtml = images.length
    ? images.map(url => `<img src="${url}" alt="Issue Image" style="max-width:100%;margin:10px 0;border-radius:6px;">`).join('')
    : '<p>No images attached.</p>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Issue Created</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f7f7f7; margin: 0; padding: 0; }
    .container { max-width: 500px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 32px; }
    .footer { font-size: 0.9em; color: #888; margin-top: 32px; }
    .status { font-weight: bold; color:rgb(19, 162, 74); }
    .images { margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Your Issue Has Been Created!</h2>
    <p>Hi ${firstName},</p>
    <p>Thank you for reporting an issue on Fixit Naija. Here are the details of your submission:</p>
    <ul>
      <li><strong>Title:</strong> ${title}</li>
      <li><strong>Description:</strong> ${description}</li>
      <li><strong>Category:</strong> ${category}</li>
      <li><strong>State:</strong> ${state}</li>
      <li><strong>Location:</strong> ${location}</li>
      <li><strong>Status:</strong> <span class="status">${status}</span></li>
    </ul>
    <div class="images">
      <strong>Attached Images:</strong><br>
      ${imagesHtml}
    </div>
    <p>We will keep you updated on the progress of your issue.</p>
    <div class="footer">
      &copy; ${currentYear} Fixit Naija. All rights reserved.
    </div>
  </div>
</body>
</html>`;
};

module.exports = NewIssueNotification;