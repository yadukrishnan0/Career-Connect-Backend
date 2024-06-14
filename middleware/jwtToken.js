const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ msg: "Access denied, token is missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Access denied, token is missing" });
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified; // assuming you want to store the verified user info in req.user
      next();
    } catch (error) {
      console.log("Invalid token", error);
      return res.status(401).json({ msg: "Access denied, invalid token" });
    }
  } catch (error) {
    console.log("Error in token verification", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = verifyToken;
