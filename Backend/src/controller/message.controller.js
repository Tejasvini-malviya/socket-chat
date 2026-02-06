const prisma = require("../lib/db.js");
const cloudinary = require("../lib/cloudinary.js");

const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const filteredUsers = await prisma.user.findMany({
      where: {
        id: { not: loggedInUserId },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        profilePic: true,
        createdAt: true,
      },
    });
    res.status(200).json({ contacts: filteredUsers });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMessageByUserId = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: userToChatId } = req.params;
    
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId }
        ]
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getting messages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getChatPartner = async (req, res) => {
  try {
    const myId = req.user.id;
    
    // Get all users who have chatted with the logged-in user
    const chatPartners = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId },
          { receiverId: myId }
        ]
      },
      select: {
        senderId: true,
        receiverId: true,
      },
      distinct: ['senderId', 'receiverId']
    });
    
    // Extract unique user IDs
    const partnerIds = new Set();
    chatPartners.forEach(msg => {
      if (msg.senderId !== myId) partnerIds.add(msg.senderId);
      if (msg.receiverId !== myId) partnerIds.add(msg.receiverId);
    });
    
    // Fetch user details
    const users = await prisma.user.findMany({
      where: {
        id: { in: Array.from(partnerIds) }
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        profilePic: true,
      }
    });
    
    res.status(200).json({ chatPartners: users });
  } catch (error) {
    console.error("Error in getChatPartner controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        text,
        image: imageUrl,
      }
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getAllContacts, getMessageByUserId, getChatPartner, sendMessage };
