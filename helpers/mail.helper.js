const nodemailer = require('nodemailer');

module.exports.sendMail = (email, subject, content) => {
    // Typecast
    const secure = process.env.EMAIL_SECURE == "true" ? true : false;

    // Create a transporter object
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    // Use false if http, true if https (online)
    secure: secure, // use false for STARTTLS; true for SSL on port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.APP_PASSWORD,
    }
  });
  
  // Configure the mailoptions object
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: content
    // If you want to send beutiful mail, change text by html, research more... 
  };
  
  // Send the email
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent: ', info.response);
    }
  });
}