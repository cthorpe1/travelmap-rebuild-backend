const router = require("express").Router();
const auth = require("../middleware/auth");
const multer = require("multer");

const Container = require("../models/Container.model");
const upload = multer();

//Handle Photo Upload

router.post("/upload", auth, upload.array('img'), (req, res) => {
  
});

module.exports = router;
