var express = require("express");
const {
  getAllLocations,
  createLocation,
} = require("../controllers/locationController");

var router = express.Router();

router.get("/", getAllLocations);
router.post("/", createLocation);

module.exports = router;
