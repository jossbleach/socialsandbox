const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Getting Post validation
const validatePostInput = require("../../validation/post");
//Getting Post model
const Post = require("../../models/Post");
//Getting Profile model
const Profile = require("../../models/Profile");

//@route - GET Request to api/posts/test
//@desc - tests posts route
//@access - public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));
//@route - GET Request to api/posts/
//@desc - get all posts
//@access - public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "No posts found." }));
});
//@route - GET Request to api/posts/:id
//@desc - get single post
//@access - public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ nopostfound: "No post found." }));
});
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
//@route - DELETE Request to api/posts/:id
//@desc - deletes a post
//@access - private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        //Check for post owner
        if (post.user.toString() !== req.user.id) {
          return res
            .status(401)
            .json({ notAuthorised: "User not authorised." });
        }
        //Delete post
        post
          .remove()
          .then(() => res.json({ success: true }))
          .catch(err =>
            res.status(404).json({ postnotfound: "Cannot find post." })
          );
      });
    });
  }
);
//@route - POST Request to api/posts/like/:id
//@desc - likes a post
//@access - private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() == req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "You have already liked this post." });
          }
          //Add user id to likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "Post not found." })
        );
    });
  }
);
//@route - POST Request to api/posts/unlike/:id
//@desc - unlikes a post
//@access - private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() == req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this post." });
          }
          //Get Remove Index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          //Splice
          post.likes.splice(removeIndex, 1);
          //Save
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "Post not found." })
        );
    });
  }
);
//@route - POST Request to api/posts/comment/:id
//@desc - adds a comment
//@access - private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //Check Validation
    if (!isValid) {
      //If errors, send 400
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        //Add to comments array
        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found." }));
  }
);
//@route - DELETE Request to api/posts/comment/:id/:comment_id
//@desc - deletes a comment
//@access - private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //Check to see if post exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotfound: "Comment does not exist." });
        }
        //Get Remove Index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);
        //Splice
        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found." }));
  }
);
module.exports = router;
