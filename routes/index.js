const express = require("express");
const router = express.Router();

//Home Page
router.get("/home", (req, res) => {
  res.send("Home Page");
});

module.exports = router;
