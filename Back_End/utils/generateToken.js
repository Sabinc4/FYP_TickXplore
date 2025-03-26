const jwt = require("jsonwebtoken");

const generateToken = (_id, role, email) => {
  return jwt.sign(
    { _id, role, email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

module.exports = generateToken;
