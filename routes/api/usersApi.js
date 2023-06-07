const express = require("express");
const router = express.Router();
const { query, check, validationResult } = require("express-validator");
const User = require("../../models/userModel");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route api/user
// @description ......
// @access Private
router.post(
  "/",
  [
    check("name", "Enter name").not().isEmpty(),
    check("email", "Enter email").not().isEmpty(),
    check("email", "Enter valid email ").isEmail(),
    check("password", "Enter a password with 2 or more chars").isLength({
      min: 2,
    }),
  ],
  async (req, res) => {
    const errRes = validationResult(req);
    if (!errRes.isEmpty()) {
      return res.status(400).json(errRes.array());
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json([{ msg: "User already exist try another email" }]);
      }
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        password,
        avatar,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtScrete"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            status: 200,
            msg: "User registered successfullt ",
            token,
          });
        }
      );
    } catch (error) {
      res.send({ msg: "failed", status: 500, error: [{ msg: error.message }] });
    }
  }
);

module.exports = router;
