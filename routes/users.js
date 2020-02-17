const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
require("dotenv").config();

const User = require("../models/User.model");

//Login Handle
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  //Check required fields
  if (!email || !password)
    return res.status(400).json("Please fill in all fields");

  //Look up existing user
  User.findOne({ email: email }).then(user => {
    if (!user) {
      res.status(400).json("That user doesn't exist");
    } else {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) return res.status(400).json("Invalid credentials");

        jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          {
            expiresIn: 3600
          },
          (err, token) => {
            if (err) throw err;
            res.json({
              token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email
              }
            });
          }
        );
      });
    }
  });
});

//Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, passwordTwo } = req.body;

  //Check required fields
  if (!name || !email || !password || !passwordTwo)
    return res.status(400).json("Please fill in all fields");
  //Check passwords match
  if (password !== passwordTwo)
    return res.status(400).json("Passwords do not match");

  //Check password length
  if (password.length < 8)
    return res.status(400).json("Password must be at least 8 characters");

  //Look up existing user
  User.findOne({ email }).then(user => {
    if (user) {
      res.status(400).json("That user already exists");
    } else {
      const newUser = new User({
        name,
        email,
        password
      });

      //Hash Password
      //Generate Salt
      bcrypt.genSalt(10, (err, salt) => {
        //Hash
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            errors.push({ message: err });
            res.status(400).json(err);
          } else {
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                jwt.sign(
                  { id: user.id },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: 3600
                  },
                  (err, token) => {
                    if (err) throw err;
                    res.json({
                      token,
                      user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                      }
                    });
                  }
                );
              })
              .catch(err => {
                res.status(400).json(err);
              });
          }
        });
      });
    }
  });
});

//Verify User Data
router.get("/verify", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then(user => {
      res.json(user);
    });
});

module.exports = router;
