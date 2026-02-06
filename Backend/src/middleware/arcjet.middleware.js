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
        if (env.NODE_ENV !== "production" || env.ARCJET_ENV === "DRY_RUN") {
          console.warn("Arcjet flagged a bot request but running in non-production/DRY_RUN; allowing request.");
        } else {
          return res.status(403).json({ error: "No bots allowed" });
        }
      }

      // For other denial reasons, allow in non-production or DRY_RUN to avoid blocking local dev
      if (env.NODE_ENV !== "production" || env.ARCJET_ENV === "DRY_RUN") {
        console.warn("Arcjet returned a denial reason but running in non-production/DRY_RUN; allowing request.");
      } else {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    if (decision.ip?.isHosting?.()) {
      if (env.NODE_ENV !== "production" || env.ARCJET_ENV === "DRY_RUN") {
        console.warn("Arcjet flagged hosting IP but running in non-production/DRY_RUN; allowing request.");
      } else {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    if (decision.results?.some(isSpoofedBot)) {
      if (env.NODE_ENV !== "production" || env.ARCJET_ENV === "DRY_RUN") {
        console.warn("Arcjet detected spoofed bot results but running in non-production/DRY_RUN; allowing request.");
      } else {
        return res.status(403).json({ error: "Forbidden" });
      }
    }

    return next();
  } catch (error) {
    console.error("Error in Arcjet middleware:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = arcjetProtection;
