const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Getting Post validation
const validatePostInput = require("../../validation/post");
//Getting Post model
const Post = require("../../models/post");

//@route - GET Request to api/posts/test
//@desc - tests posts route
//@access - public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

//@route - POST Request to api/posts/
//@desc - create a post
//@access - private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //Check Validation
    if (!isValid) {
      //If errors, send 400
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

module.exports = router;
