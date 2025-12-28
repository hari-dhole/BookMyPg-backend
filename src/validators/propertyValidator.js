const { body, param, query } = require("express-validator");

exports.createPropertyValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("rent").optional().isNumeric().withMessage("Rent must be a number"),
  body("totalbeds")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Total beds must be >= 1"),
];

exports.updatePropertyValidator = [
  param("id").isMongoId().withMessage("Invalid Property ID"),
];

exports.listPropertyValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("order").optional().isIn(["asc", "desc"]),
];
