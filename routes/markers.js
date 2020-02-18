const router = require("express").Router();
const auth = require("../middleware/auth");

const User = require("../models/User.model");

//Add Top Level Marker
router.post("/add", auth, (req, res) => {

});

module.exports = router;
