const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter using Gmail service and your app password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send a general email
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"TickXplore" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    // Sending the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent to:", to);
    return {
      success: true,
      messageId: info.messageId, // return message ID for logging purposes
    };
  } catch (err) {
    // Catching errors and logging them
    console.error("Error sending email:", err);
    throw new Error(`Failed to send email: ${err.message}`);
  }
};

// Specific function for sending password reset emails
const sendResetEmail = async (email, resetUrl) => {
  const subject = "Password Reset Request - TickXplore";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Password Reset Request</h2>
      <p>You requested to reset your password for TickXplore. Click the button below to proceed:</p>
      <a href="${resetUrl}" 
         style="display: inline-block; padding: 12px 24px; background-color: #2563eb; 
                color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Reset Password
      </a>
      <p>If you didn't request this, please ignore this email.</p>
      <p style="font-size: 12px; color: #6b7280;">This link will expire in 1 hour.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="font-size: 12px; color: #6b7280;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        ${resetUrl}
      </p>
    </div>
  `;
  
  // Send the email using the sendEmail function
  return sendEmail(email, subject, html);
};

// Specific function for sending OTP email for registration or verification
const sendSignupOTP = async (email, otp) => {
  const subject = "Verify Your TickXplore Account";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">Welcome to TickXplore!</h2>
      <p>Thank you for signing up. Please verify your account using the OTP below:</p>
      <div style="font-size: 24px; font-weight: bold; color: #1d4ed8; margin: 20px 0;">
        ${otp}
      </div>
      <p>This OTP will expire in 10 minutes.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="font-size: 12px; color: #6b7280;">
        If you did not request this account, you can ignore this message.
      </p>
    </div>
  `;
  
  // Send the email using the sendEmail function
  return sendEmail(email, subject, html);
};

module.exports = {
  sendEmail,
  sendResetEmail,
  sendSignupOTP,
};
