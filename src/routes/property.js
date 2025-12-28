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
} = require("../validators/property.validator");

router.get("/properties", listPropertyValidator, validate, getAllProperties);

router.get(
  "/owner/:id/properties",
  listPropertyValidator,
  validate,
  getAllProperties
);

router.get("/properties/:id", getPropertyById);

router.post("/properties", createPropertyValidator, validate, createProperty);

router.put(
  "/properties/:id",
  updatePropertyValidator,
  validate,
  updatePropertyById
);

router.delete("/properties/:id", deletePropertyById);

module.exports = router;
