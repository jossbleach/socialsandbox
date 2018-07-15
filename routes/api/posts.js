const express = require("express");
const router = express.Router();

//@route - GET Request to api/posts/test
//@desc - tests posts route
//@access - public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

module.exports = router;
