const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");

const User = require("../../models/userModel");

// @route api/auth
// @description ......
// @access Private
router.get("/", auth, async (req, res) => {
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

module.exports = router;
