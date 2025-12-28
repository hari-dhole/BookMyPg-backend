var express = require("express");
var { getAllAmenitites } = require("../controllers/amenityController");
const router = express.Router();

router.get("/", getAllAmenitites);

module.exports = router;
