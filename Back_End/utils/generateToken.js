const jwt = require("jsonwebtoken");

const generateAccessToken = ({ _id, role, email }) => {
  return jwt.sign({ _id, role, email }, process.env.JWT_SECRET, {
    expiresIn: "15m", // short lifespan
  });
};

const generateRefreshToken = ({ _id, role, email }) => {
  return jwt.sign({ _id, role, email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "15m", 
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
