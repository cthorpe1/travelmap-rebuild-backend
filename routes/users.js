const router = require("express").Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
let User = require("../models/User.model");

//Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      res.json({ message: err });
    }
    if (info !== undefined) {
      res.json({ message: info.message });
    } else {
      req.logIn(user, err => {
        if (err) {
          res.json({ message: err });
        }
        User.findOne({ email: user.email }).then(user => {
          const token = jwt.sign({ id: user.email }, "jwt-secret");
          res.status(200).json({
            auth: true,
            token: token,
            message: "user found and logged in"
          });
        });
      });
    }
  })(req, res, next);
});

//Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
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
    User.findOne({ email: email }).then(user => {
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
                  res.redirect("/users/login");
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

module.exports = router;
