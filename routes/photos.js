const router = require("express").Router();
const auth = require("../middleware/auth");
const multer = require("multer");

const Container = require("../models/Container.model");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/../uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

//Handle Photo Upload
router.post("/upload", auth, upload.array("img"), (req, res) => {
  Container.findById(req.body.currentParent)
    .then((container) => {
      for (let i = 0; i < req.files.length; i++) {
        container.photos.push(req.files[i].path);
      }
      container.save().then((container) => res.status(200).json(container));
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.get("/:containerId", auth, (req, res) => {
  Container.findById(req.params.containerId).then((container) => {
    console.log(container);
  });
});

module.exports = router;
