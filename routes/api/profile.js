const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Profile
const Profile = require("../../models/Profile");
//Load User
const User = require("../../models/User");

//@route - GET Request to api/profile/test
//@desc - tests profile route
//@access - public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));
//@route - GET Request to api/profile
//@desc - Gets current user profile
//@access - private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
