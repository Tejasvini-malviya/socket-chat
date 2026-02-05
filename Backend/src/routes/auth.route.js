const express = require("express");
const router = express.Router();
const controller = require("../controller/auth.controller.js");
const protectedRoute = require("../middleware/auth.middleware.js");
const arcjetProtection  = require("../middleware/arcjet.middleware.js");

router.get("/test", arcjetProtection, (req, res) => {
  res.status(200).json({ Message: "This is for testing" });
});
router.post("/signup", arcjetProtection, controller.signup);
router.post("/login", arcjetProtection, controller.login);
router.post("/logout", controller.logout);
router.put("/update-profile", protectedRoute, controller.updateProfile);
router.get("/check", protectedRoute, (req, res) =>
  res.status(200).json(req.user),
);
module.exports = router;
