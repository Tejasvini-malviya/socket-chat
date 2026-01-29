-- Database aur User table manually create karne ke liye SQL
CREATE DATABASE socket;

-- Socket database mein connect karne ke baad yeh run karo:
CREATE TABLE "User" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  "fullName" TEXT NOT NULL,
  password TEXT NOT NULL,
  "profilePic" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index banao email ke liye fast search
CREATE UNIQUE INDEX "User_email_key" ON "User"(email);
