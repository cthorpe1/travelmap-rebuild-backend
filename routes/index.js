const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

//Home Page
router.get("/home", ensureAuthenticated, (req, res) => {
  res.send("Home Page");
});

module.exports = router;
