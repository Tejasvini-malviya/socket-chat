const emailTemplate = (name, clientURL) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Chat App</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; }
        .button { display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Chat App, ${name}!</h1>
        <p>Thank you for signing up. We're excited to have you on board.</p>
        <a href="${clientURL}" class="button">Get Started</a>
        <p>If you have any questions, feel free to reach out to us.</p>
        <p>Best regards,<br>Chat App Team</p>
    </div>
</body>
</html>
`;

module.exports = { emailTemplate };