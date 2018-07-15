const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

//Load User model
const User = require("../../models/User");

//@route - GET Request to api/users/test
//@desc - tests users route
//@access - public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

//@route - GET Request to api/users/register
//@desc - Register user
//@access - Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      //Using the gravatar package to get an avatar
      const avatar = gravatar.url(req.body.email, {
        s: "200", //The size we want to use
        r: "pg", //Rating
        d: "mm" //Default value
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      //Encrypting the password with bcrypt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(console.log(err));
        });
      });
    }
  });
});

//@route - POST Request to api/users/login
//@desc - Login user / Returning JWT
//@access - Public
router.post("/login", (req, res) => {
  //Saving email and password as variables
  const email = req.body.email;
  const password = req.body.password;
  //Find user by email
  User.findOne({ email }).then(user => {
    //Check for user
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }
    //Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; //JWT Payload (info being passed to server)

        //Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 7200 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Password Incorrect" });
      }
    });
  });
});
module.exports = router;
