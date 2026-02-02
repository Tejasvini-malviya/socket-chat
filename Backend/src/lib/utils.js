const jwt = require("jsonwebtoken");
const env = require("./env.js");

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: env.NODE_ENV === "production",
  });

  return token;
};

module.exports = { generateToken };
