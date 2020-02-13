const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
require("dotenv").config();

const User = require("../models/User.model");

//Login Handle
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  let errors = [];

  //Check required fields
  if (!email || !password)
    errors.push({ message: "Please fill in all fields" });

  if (errors.length > 0) {
    res.json({ errors: errors });
    console.log(errors);
  } else {
    //Look up existing user
    User.findOne({ email: email }).then(user => {
      if (!user) {
        errors.push({ message: "That user doesn't exist" });
        res.json({ errors: errors });
      } else {
        bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });

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
  }
});

//Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, passwordTwo } = req.body;
  let errors = [];

  //Check required fields
  if (!name || !email || !password || !passwordTwo)
    errors.push({ message: "Please fill in all fields" });

  //Check passwords match
  if (password !== passwordTwo)
    errors.push({ message: "Passwords do not match" });

  //Check password length
  if (password.length < 8)
    errors.push({ message: "Password must be at least 8 characters" });

  if (errors.length > 0) {
    res.json({ errors: errors });
    console.log(errors);
  } else {
    //Look up existing user
    User.findOne({ email }).then(user => {
      if (user) {
        errors.push({ message: "That user already exists" });
        res.json({ errors: errors });
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
              res.json({ errors: errors });
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
                  errors.push({ message: err });
                  res.json({ errors: errors });
                });
            }
          });
        });
      }
    });
  }
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
