const express = require("express");
const path = require("path");
const env = require("./lib/env.js");
const prisma = require("./lib/db.js");
const authRoutes = require("./routes/auth.route.js");
const messageRoutes = require("./routes/message.route.js");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Socket Chat API", version: "1.0.0" });
});

// Serve static files in production
if (env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

const server = app.listen(env.PORT, () => {
  console.log(`✓ Server running on http://localhost:${env.PORT}`);
  console.log(`✓ Environment: ${env.NODE_ENV}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  server.close();
  process.exit(0);
});
