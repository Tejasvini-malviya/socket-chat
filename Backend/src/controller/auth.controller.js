const bcrypt = require("bcrypt");
const prisma = require("../lib/db.js");
const env = require("../lib/env.js");
const { generateToken } = require("../lib/utils.js");
const { sendWelcomeEmail } = require("../emails/emailHandler.js");
const cloudinary = require("../lib/cloudinary.js");
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

    // Send welcome email (non-blocking)
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
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.warn(`Login attempt failed: User not found for email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      console.warn(`Login attempt failed: Incorrect password for email: ${email}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token and set cookie
    generateToken(user.id, res);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    console.log(`User logged in successfully: ${email}`);
    return res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error in Login controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in Logout controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  const { profilePic } = req.body;

  try {
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { profilePic: uploadResponse.secure_url },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

    return res.status(200).json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error in updateProfile controller:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signup, login, logout, updateProfile };
