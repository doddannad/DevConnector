const express = require("express");
const router = express.Router();

// @route api/profile
// @description ......
// @access Private
router.get("/", (req, res) => res.send("Profile API"));

module.exports = router;
