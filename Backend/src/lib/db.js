const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma client with adapter
const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"], // Enable logging to see SQL queries
});

// Test the connection
prisma.$connect()
  .then(() => console.log("Database connection successful"))
  .catch((err) => console.error("Database connection failed:", err));

module.exports = prisma;
