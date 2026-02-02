const jwt = require("jsonwebtoken");
const prisma = require("../lib/db.js");
const env = require("../lib/env.js");

const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token)
            return res
                .status(401)
                .json({ message: "Unauthorized-No Token Provided" });
        const decoded = jwt.verify(token, env.JWT_SECRET);
        if (!decoded)
            return res
                .status(401)
                .json({ message: "Unauthorized-No Token Provided" });

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user) return res.status(404).json({ message: "user not found" });

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in ProtectRoute middleware:", error);
        res.status(500).json({ message: "Internal server Error" });
    }
};

module.exports = protectedRoute;
