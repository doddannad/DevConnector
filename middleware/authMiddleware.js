const jwt = require("jsonwebtoken");
const config = require("config");
const jwtScrete = config.get("jwtScrete");

const auth = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.json({ status: 401, message: "Unauthorized token not found" });
  }
  try {
    const decoded = jwt.verify(token, jwtScrete);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.send({ status: 401, msg: "Invalid token" });
  }
};

module.exports = auth;
