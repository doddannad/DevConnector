const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const { check, validationResult } = require("express-validator");
const Post = require("../../models/postModel");
const User = require("../../models/userModel");

// @route api/post
// @description ......
// @access Private
// @method POST
router.post(
  "/",
  [authMiddleware, [check("text", "Enter post text").notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ status: 400, msg: "failed", errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: user.id,
      };
      const post = new Post(newPost);
      await post.save();
      res.json({ status: 200, msg: "success", post });
    } catch (error) {
      res.json({ status: 500, msg: "failed", msg: [{ msg: error.message }] });
    }
  }
);

// @route api/post
// @description ..Get all posts....
// @access Private
// @method GET

router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json({ status: 200, msg: "success", posts });
  } catch (error) {
    res.json({ status: 500, msg: error.message });
  }
});

// @route api/post/:id
// @description ..Get all posts....
// @access Private
// @method GET

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.json({
        status: 404,
        msg: "failed",
        erros: [{ msg: "Post not found" }],
      });
    res.json({ status: 200, msg: "success", post });
  } catch (error) {
    if (error.kind == "ObjectId")
      return res.json({
        status: 404,
        msg: "failed",
        erros: [{ msg: "Post not found" }],
      });
    res.json({ status: 500, msg: error.message });
  }
});

// @route api/post/:id
// @description ..Get all posts....
// @access Private
// @method DELETE

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.json({
        status: 404,
        msg: "failed",
        erros: [{ msg: "Post not found" }],
      });
    if (post.user.toString() !== req.user.id) {
      return res.json({
        status: 401,
        msg: "failed",
        erros: [{ msg: "Unauthorized to delete" }],
      });
    }
    console.log("post ", post);
    await post.deleteOne();
    res.json({ status: 200, msg: "success" });
  } catch (error) {
    if (error.kind == "ObjectId")
      return res.json({
        status: 404,
        msg: "failed",
        erros: [{ msg: "Post not found" }],
      });
    res.json({ status: 500, msg: error.message });
  }
});

// @route api/post/like/:post_id
// @description ..Like and unlike....
// @access Private
// @method PUT
router.put("/like/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.json({ status: 400, errors: [{ mg: "Post not fount" }] });
    }

    const like = post.likes.filter(
      (like) => like.user.toString() === req.user.id
    ).length;

    if (like > 0) {
      const removeIndex = post.likes
        .map((like) => like.user)
        .indexOf(req.user.id);
      post.likes.splice(removeIndex, 1);
    } else {
      post.likes.unshift({ user: req.user.id });
    }
    await post.save();
    res.json({ status: 200, msg: "success", likes: post.likes.length });
  } catch (error) {
    if (error.kind == "ObjectId") {
      return res.json({ status: 400, errors: [{ mg: "Post not fount" }] });
    }
    res.json({ status: 500, msg: error.message });
  }
});

// @route api/post/comment/:post_id
// @description ..Add Comment....
// @access Private
// @method PUT
router.put(
  "/comment/:id",
  [authMiddleware, [check("text", "Enter comment text").notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.json({ status: 400, errors: errors.array() });
    const { text } = req.body;
    try {
      const post = await Post.findById(req.params.id);
      const user = await User.findById(req.user.id).select("-password");

      if (!post) {
        return res.json({ status: 400, errors: [{ mg: "Post not fount" }] });
      }
      const newComment = {
        text,
        name: user.name,
        avatar: user.avatar,
        user: user.id,
      };
      post.comments.unshift(newComment);
      await post.save();
      res.send({ status: 200, msg: "success", comments: post.comments });
    } catch (error) {
      if (error.kind === "ObjectId")
        return res.send({ status: 400, msg: "Post not found" });
      res.json({ status: 500, msg: error.message });
    }
  }
);

// @route api/post/comment/:post_id/:comment
// @description ..Delete comment....
// @access Private
// @method DELETE
router.delete(
  "/comment/:post_id/:comment_id",
  authMiddleware,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.post_id);
      const comment = post.comments.find(
        (comment) => comment.id === req.params.comment_id
      );
      console.log("comment ", comment);
      if (!post) {
        return res.json({ status: 400, errors: [{ mg: "Post not found" }] });
      }

      if (!comment) {
        return res.json({ status: 400, errors: [{ mg: "Comment not found" }] });
      }

      if (comment.user.toString() !== req.user.id) {
        return res.json({
          status: 401,
          errors: [{ mg: "Unauthorized to delete" }],
        });
      }
      const reomveIndex = post.comments
        .map((comment) => comment.id)
        .indexOf(req.params.comment_id);

      post.comments.splice(reomveIndex, 1);
      await post.save();
      res.json({ status: 200, msg: "success", comments: post.comments });
    } catch (error) {
      if (error.kind === "ObjectId")
        return res.send({ status: 400, msg: "Post not found" });
      res.json({ status: 500, msg: error.message });
    }
  }
);
module.exports = router;
