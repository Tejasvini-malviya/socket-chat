const express = require("express");
const router = express.Router();
const controller = require("../controller/auth.controller.js");

// router.get("/", (req, res) => {
//   res.send("Auth Route");
// });

router.get("/login", controller.login);

router.get("/signup", controller.signup);

router.get("/logout", controller.logout);

module.exports = router;
