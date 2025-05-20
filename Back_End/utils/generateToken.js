const jwt = require("jsonwebtoken");

const generateAccessToken = ({ _id, role, email }) => {
  return jwt.sign({ _id, role, email }, process.env.JWT_SECRET, {
    expiresIn: "1hr",
  });
};

const generateRefreshToken = ({ _id, role, email }) => {
  return jwt.sign({ _id, role, email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "1hr", 
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
