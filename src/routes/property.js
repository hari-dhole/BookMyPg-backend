const express = require("express");
const router = express.Router();

const {
  createProperty,
  deletePropertyById,
  getAllProperties,
  getPropertyById,
  updatePropertyById,
} = require("../controllers/propertyController");
const validate = require("../middlewares/validate");
const {
  createPropertyValidator,
  updatePropertyValidator,
  listPropertyValidator,
} = require("../validators/propertyValidator");

router.get("/", listPropertyValidator, validate, getAllProperties);
router.get("/owner/:id", listPropertyValidator, validate, getAllProperties);
router.get("/:id", getPropertyById);
router.post("/", createPropertyValidator, validate, createProperty);
router.put("/:id", updatePropertyValidator, validate, updatePropertyById);
router.delete("/:id", deletePropertyById);

module.exports = router;
