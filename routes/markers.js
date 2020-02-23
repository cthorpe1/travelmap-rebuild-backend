const router = require("express").Router();
const auth = require("../middleware/auth");

const Container = require("../models/Container.model");

//Get Top Level Containers
router.get("/", auth, (req, res) => {
  Container.find({ parentContainer: null })
    .then(containers => {
      if (containers.length < 1) res.status(400).json("No markers in database");
      else res.json(containers);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

//Add Top Level Container
router.post("/add", auth, (req, res) => {
  //Check if Marker already there
  Container.findOne({ ownedBy: req.user.id, name: req.body.name })
    .then(container => {
      if (container) res.status(400).json("You already have a container there");
      else {
        const newContainer = new Container({
          name: req.body.name,
          coordinates: req.body.coordinates,
          ownedBy: req.user.id
        });
        newContainer.save().then(container => {
          res.status(200).json(container);
        });
      }
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

module.exports = router;
