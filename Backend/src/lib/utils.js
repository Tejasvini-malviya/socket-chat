const jwt = require("jsonwebtoken");

// Yeh function JWT token generate karta hai aur cookie mein store karta hai
const generateToken = (userId, res) => {
  // User ID se token banate hain jo 7 din tak valid rahega

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // 7 din ka expiry time
  });

  // Token ko cookie mein store karte hain with security settings

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true, // XSS attacks se bachne ke liye - client side se access nahi ho sakta
    sameSite: "strict", // CSRF attacks se protection ke liye
    secure: process.env.NODE_ENV === "production" ? true : false, // Production mein HTTPS chahiye
  });

  return token;
};

module.exports = { generateToken };
