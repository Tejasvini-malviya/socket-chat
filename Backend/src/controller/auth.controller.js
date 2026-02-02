const bcrypt = require("bcrypt");
const prisma = require("../lib/db.js");
const env = require("../lib/env.js");
const { generateToken } = require("../lib/utils.js");
const { sendWelcomeEmail } = require("../emails/emailHandler.js");
const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be more than 6 characters" });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
      },
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(newUser.email, newUser.fullName, env.CLIENT_URL);
    } catch (error) {
      console.warn("Failed to send welcome email:", error.message);
    }

    // Generate token and set cookie
    generateToken(newUser.id, res);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error in Signup controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  res.send("login endpoint");
};

const logout = async (req, res) => {
  res.send("logout endpoint");
};

module.exports = { signup, login, logout };
