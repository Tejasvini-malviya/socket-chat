const express = require("express");
const router = express.Router();
const controller = require("../controller/auth.controller.js");
const protectedRoute = require("../middleware/auth.middleware.js");

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.put("/update-profile",protectedRoute,controller.updateProfile);
router.get("/check",protectedRoute,(req,res)=>res.status(200).json(req.user));
module.exports = router;
