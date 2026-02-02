const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const env = require("./env.js");

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma client with adapter
const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === "production" ? ["error"] : ["query", "info", "warn", "error"],
});

// Test the connection
prisma
  .$connect()
  .then(() => console.log("✓ Database connection successful"))
  .catch((err) => {
    console.error("✗ Database connection failed:", err.message);
    process.exit(1);
  });

module.exports = prisma;
