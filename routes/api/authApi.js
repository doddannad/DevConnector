const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const User = require("../../models/userModel");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtScrete = config.get("jwtScrete");

// @route api/auth
// @description ......
// @access Private
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.json({ msg: "success", status: 200, user });
  } catch (error) {
    return res.json({
      msg: "failed",
      status: 500,
      error: [{ msg: error.message }],
    });
  }
});

// @route api/auh
// @description ......
// @access Public

router.post(
  "/",
  [
    check("email", "Enter a valid email").isEmail(),
    check("password", "Password is required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 400, msg: "failed", errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.json({
          status: 200,
          msg: "failed",
          errors: [{ msg: "Email not exist" }],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({
          status: 200,
          msg: "failed",
          errors: [{ msg: "Invalid credentials" }],
        });
      }
      const payload = {
        user: { id: user.id },
      };
      jwt.sign(payload, jwtScrete, { expiresIn: 36000 }, (error, token) => {
        if (error) throw error;
        res.json({ status: 200, msg: "success", token });
      });
    } catch (error) {
      res.json({
        status: 500,
        msg: "failed",
        errors: [{ msg: "Something went wrong" }],
      });
    }
  }
);

module.exports = router;
