const router = require("express").Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
let User = require("../models/User.model");

//Login
router.get("/login", (req, res) => {
  res.send("Login Page");
});

//Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/users/login"
  })(req, res, next);
});

//Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

//Register
router.get("/register", (req, res) => {
  res.send("Register Page");
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
    //Send errors back to client
  } else {
    //Look up existing user
    User.findOne({ email: email }).then(user => {
      if (user) errors.push({ message: "That user already exists" });
      else {
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
            if (err) errors.push({ message: err });
            else {
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  res.redirect("/users/login");
                })
                .catch(err => errors.push({ message: err }));
            }
          });
        });
      }
    });
  }
});

module.exports = router;
