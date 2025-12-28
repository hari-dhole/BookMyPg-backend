var express = require("express");
const {
  createAmenity,
  getAllAmenities,
  getAmenityById,
  toggleAmenityStatus,
  updateAmenity,
} = require("../controllers/amenityController");
const auth = require("../middlewares/auth");
const { ROLE } = require("../../constants");

var router = express.Router();

router.get("/", getAllAmenities);
router.get("/:id", getAmenityById);
router.post("/", auth.protect, auth.restrictTo(ROLE.Admin), createAmenity);
router.put("/:id", toggleAmenityStatus);
router.delete("/:id", updateAmenity);

module.exports = router;
