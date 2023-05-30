const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const Profile = require("../../models/profileModel");
const { check, validationResult } = require("express-validator");
const User = require("../../models/userModel");
// for git repos
const request = require("request");
const config = require("config");

// @route api/profile/me
// @description ......
// @access Private
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "email", "avatar"]
    );
    if (!profile) {
      return res.json({
        status: 400,
        msg: "failed",
        errors: [{ msg: "Profile not found" }],
      });
    }
    res.json({ status: 200, msg: "success", profile });
  } catch (error) {
    res.json({
      status: 500,
      msg: "failed",
      errors: [{ msg: error.message }],
    });
  }
});

// @route api/profile
// @description ......
// @access Public

router.post(
  "/",
  [
    authMiddleware,
    [
      check("status", "Enter status").not().isEmpty(),
      check("skills", "Enter skills ").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 400, msg: "failed", errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    // Skills - Spilt into array
    if (typeof skills !== "undefined") {
      profileFields.skills = skills.split(",");
    }

    // Social
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json({ status: 200, msg: "success", profile });
      } else {
        profile = new Profile(profileFields);
        profile.save();
        return res.json({ status: 200, msg: "success", profile });
      }
    } catch (error) {
      res.send({ status: 500, errors: [{ msg: error.message }] });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json({ status: 200, msg: "success", profiles });
  } catch (error) {
    res.json({ status: 500, msg: error.message });
  }
});

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile)
      return res.json({ status: 400, msg: "User profile not found" });
    res.json({ status: 200, msg: "success", profile });
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.json({ status: 400, msg: "User profile not found" });
    }
    res.json({ status: 500, msg: error.message });
  }
});

router.delete("/", authMiddleware, async (req, res) => {
  console.log("req.user ", req.user);
  try {
    // TODO delete post
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ status: 200, msg: "success" });
  } catch (error) {
    res.json({ status: 200, msg: "failed", errors: [{ msg: error.message }] });
  }
});

router.put(
  "/experience",
  [
    authMiddleware,
    [
      check("title", "Title required").notEmpty(),
      check("company", "Company required").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 400, msg: "failed", errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = { title, company, location, from, to, current, description };
    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate(
        "user",
        ["name", "avatar"]
      );
      if (!profile)
        return res.json({
          status: 400,
          errors: [{ msg: "Profile not found" }],
        });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json({ status: 200, msg: "success", profile });
    } catch (error) {
      res.json({ status: 500, errors: [{ msg: error.message }] });
    }
  }
);

router.delete("/experience/:exp_id", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile)
      return res.json({
        status: 400,
        errors: [{ msg: "Profile not found" }],
      });
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    if (removeIndex >= 0) profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json({ status: 200, msg: "success", profile });
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.json({
        status: 400,
        errors: [{ msg: "Profile not found" }],
      });
    }
    res.json({ status: 500, errors: [{ msg: error.message }] });
  }
});

// @route api/profile/education
// @description ......
// @access Private
// @method post
router.post("/education", [authMiddleware, []], async (req, res) => {
  const { school, degree, fieldofstudy, from, to, current, description } =
    req.body;

  const newEducation = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  };
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.education.unshift(newEducation);
    await profile.save();
    res.json({ status: 200, msg: "success", profile });
  } catch (error) {
    res.json({ status: 500, erros: [{ msg: error.message }] });
  }
});

// @route api/profile/education/edu_id
// @description ......
// @access Private
// @method delete
router.delete("/education/:edu_id", [authMiddleware, []], async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    removeIndex >= 0 && profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json({ status: 200, msg: "success", profile });
  } catch (error) {
    res.json({ status: 500, erros: [{ msg: error.message }] });
  }
});

// @route api/profile/github
// @description ......
// @access Public
// @method get
router.get("/github/:username", async (req, res) => {
  const options = {
    uri: `https://api.github.com/users/${
      req.params.username
    }/repos/per_page=5&sort=created:asc&client_id=${config.get(
      "github_client"
    )}&client_screte=${config.get("github_screte")}`,
    method: "get",
    headers: { "user-agent": "node.js" },
  };
  request(options, (error, response, body) => {
    if (error) {
      return res.json({ status: 400, errors: error });
    }

    if (response.statusCode !== 200) {
      return res.json({
        status: 404,
        msg: "",
        errors: [{ msg: "Git repos not found" }],
      });
    }
    res.json({
      status: 200,
      msg: "success",
      body: JSON.parse(body),
    });
  });
});

module.exports = router;
