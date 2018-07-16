const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");
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
      .populate("user", ["name", "avatar"])
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
//@route - GET Request to api/profile/all
//@desc - GET all profiles
//@access - public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles.";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profiles: "There are no profiles." }));
});
//@route - GET Request to api/profile/handle/:handle
//@desc - GET profile by handle
//@access - public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile with this name.";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});
//@route - GET Request to api/profile/user/:user_id
//@desc - GET profile by user id
//@access - public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile with this name.";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res
        .status(404)
        .json({ profile: "There is no profile associated with this user." })
    );
});
//@route - POST Request to api/profile
//@desc - Create or edit user profile
//@access - private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    //Check validation
    if (!isValid) {
      //Return any errors with 400 status
      return res.status(400).json({ errors });
    }
    //Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubUser) profileFields.githubUser = req.body.githubUser;
    //Skills split into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    //Social Links
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.behance) profileFields.social.behance = req.body.behance;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //Check for the profile, if it exists then the update code block here will be executed
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //Else if a profile doesn't exist, it will execute the new profile code down here
        //Check to see if handle exists (used to access profile)
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }
          //Save the new profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);
//@route - POST Request to api/profile/experience
//@desc - POST experience to profile
//@access - private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    //Check validation
    if (!isValid) {
      //Return any errors with 400 status
      return res.status(400).json({ errors });
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        dateFrom: req.body.dateFrom,
        dateTo: req.body.dateTo,
        current: req.body.current,
        description: req.body.description
      };
      //Add to experience array on profile
      profile.experience.unshift(newExp);
      profile.save().then(profile => res.json(profile));
    });
  }
);
//@route - POST Request to api/profile/education
//@desc - POST education to profile
//@access - private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    //Check validation
    if (!isValid) {
      //Return any errors with 400 status
      return res.status(400).json({ errors });
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        field: req.body.field,
        dateFrom: req.body.dateFrom,
        dateTo: req.body.dateTo,
        current: req.body.current,
        description: req.body.description
      };
      //Add to experience array on profile
      profile.education.unshift(newEdu);
      profile.save().then(profile => res.json(profile));
    });
  }
);
//@route - DELETE Request to api/profile/exprience/:exp_id
//@desc - Deletes an experience entry from th
//@access - private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //Get Remove Index
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);
        //Splice out of array
        profile.experience.splice(removeIndex, 1);
        //Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);
//@route - DELETE Request to api/profile/education/:edu_id
//@desc - Deletes an education entry from th
//@access - private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        //Get Remove Index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.exp_id);
        //Splice out of array
        profile.education.splice(removeIndex, 1);
        //Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);
//@route - DELETE Request to api/profile/
//@desc - Deletes a user and their profile
//@access - private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
