const prisma = require("../lib/db.js");

// Export the prisma.user model for use in controllers
module.exports = prisma.user;
