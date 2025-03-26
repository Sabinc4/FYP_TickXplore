const nodemailer = require("nodemailer");

// Function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP to user's email
const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',  
    auth: {
      user: process.env.EMAIL_USER,  
      pass: process.env.EMAIL_PASS,  
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,  
    to: email,  
    subject: 'Your OTP for Verification',
    text: `Your OTP is: ${otp}`, 
  };

  try {
    await transporter.sendMail(mailOptions); 
    console.log("OTP sent successfully.");
  } catch (err) {
    console.error("Error sending OTP:", err);
  }
};

module.exports = { sendOTP, generateOTP };
