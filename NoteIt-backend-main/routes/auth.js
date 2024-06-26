//express validation

const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "rajatIsAGoodBoy";

// Route-1: Create a User using: POST "/api/auth/createuser". Doesn't require login
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //if there are errors return bad request and errors
    const errors = validationResult(req);
    let sucess = false;
    try {
      if (!errors.isEmpty()) {
        return res.status(400).json({ sucess, errors: errors.array() });
      }

      //check whether the same email with this email exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        console.log(user);
        return res.status(400).json({
          sucess,
          error:
            "Sorry a user already exist with this email. Try using other email",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      sucess = true;
      res.json({ sucess, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route-2: Authenticate a User using: POST "/api/auth/login". no login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be null").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let sucess = false;
    try {
      if (!errors.isEmpty()) {
        return res.status(400).json({ sucess, errors: errors.array() });
      }

      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          sucess,
          error: "Please try to login with the correct credentials",
        });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          sucess,
          error: "Please try to login with the correct credentials(password)",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      sucess = true;
      res.json({ sucess, authToken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error!");
    }
  }
);

//Route-3: get login user details using: POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

module.exports = router;
