const arcjet = require("@arcjet/node").default;
const { shield, detectBot, slidingWindow } = require("@arcjet/node");
const env = require("./env.js");
if (!env.ARCJET_KEY) {
  console.warn("ARCJET_KEY is not set. Arcjet protection is disabled.");
  module.exports = null;
  return;
}

const mode = env.ARCJET_ENV === "DRY_RUN" ? "DRY_RUN" : "LIVE";
const aj = arcjet({
  key: env.ARCJET_KEY,
  rules: [
    shield({ mode }),
    detectBot({
      mode,
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    slidingWindow({
      mode,
      max: 100,
      interval: 60,
    }),
  ],
});

// app.get("/", async (req, res) => {
//   const decision = await aj.protect(req, { requested: 5 }); // Deduct 5 tokens from the bucket
//   console.log("Arcjet decision", decision);

//   if (decision.isDenied()) {
//     if (decision.reason.isRateLimit()) {
//       res.writeHead(429, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ error: "Too Many Requests" }));
//     } else if (decision.reason.isBot()) {
//       res.writeHead(403, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ error: "No bots allowed" }));
//     } else {
//       res.writeHead(403, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ error: "Forbidden" }));
//     }
//   } else if (decision.ip.isHosting()) {
//     res.writeHead(403, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ error: "Forbidden" }));
//   } else if (decision.results.some(isSpoofedBot)) {
//     res.writeHead(403, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ error: "Forbidden" }));
//   } else {
//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ message: "Hello World" }));
//   }
// });

module.exports = aj;
