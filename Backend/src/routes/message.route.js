const express = require("express");
const router = express.Router();
const {
  getAllContacts,
  getMessageByUserId,
  getChatPartner,
  sendMessage,
} = require("../controller/message.controller.js");
const protectedRoute = require("../middleware/auth.middleware.js");
const arcjetProtection = require("../middleware/arcjet.middleware.js");

// Always protect routes; Arcjet middleware is a noop when not configured
router.use(protectedRoute);
router.use(arcjetProtection);

router.get("/", (req, res) => {
  res.send("Message Route");
});

// Get all chat partners (users you've chatted with)
router.get("/chat", getChatPartner);

// Get all contacts (all users except yourself)
router.get("/contacts", getAllContacts);

// Get messages with a specific user
router.get("/:id", getMessageByUserId);

// Send a message to a specific user
router.post("/:id", sendMessage);

module.exports = router;

