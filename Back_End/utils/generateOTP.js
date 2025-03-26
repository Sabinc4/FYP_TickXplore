// generateOTP.js
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);  // Random 6-digit number
  };
  
  module.exports = generateOTP;
  