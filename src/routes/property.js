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
const auth = require("../middlewares/auth");
const { ROLE } = require("../../constants");

/**
 * PUBLIC ROUTE (No auth)
 */
router.get("/", listPropertyValidator, validate, getAllProperties);
router.get("/owner/:id", listPropertyValidator, validate, getAllProperties);
router.get("/:id", getPropertyById);

/**
 * Apply auth + owner restriction to ALL routes below
 */
router.use(auth.protect);
router.use(auth.restrictTo(ROLE.Owner));

/**
 * PROTECTED ROUTES (Owner only)
 */
router.post("/", createPropertyValidator, validate, createProperty);
router.put("/:id", updatePropertyValidator, validate, updatePropertyById);
router.delete("/:id", deletePropertyById);

module.exports = router;
