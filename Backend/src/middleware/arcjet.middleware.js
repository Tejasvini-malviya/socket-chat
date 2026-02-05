const aj = require("../lib/arcjet.js");
const env = require("../lib/env.js");
const { isSpoofedBot } = require("@arcjet/inspect");
const arcjetProtection = async (req, res, next) => {
  try {
    if (!env.ARCJET_KEY || !aj) return next();

    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ error: "No bots allowed" });
      }

      return res.status(403).json({ error: "Forbidden" });
    }

    if (decision.ip?.isHosting?.()) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (decision.results?.some(isSpoofedBot)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return next();
  } catch (error) {
    console.error("Error in Arcjet middleware:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = arcjetProtection;
