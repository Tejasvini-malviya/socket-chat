require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const authRoutes = require("./routes/auth.route.js");
const messageRoutes = require("./routes/message.route.js");
const path = require("path");

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../Frontend/dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"));
  });
}

app.listen(port, () => {
  console.log("server is running on port", port);
});
