const { body, param } = require("express-validator");

exports.createReviewValidator = [
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isNumeric()
    .withMessage("Rating must be a number"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("reviewedby")
    .notEmpty()
    .isMongoId()
    .withMessage("Invalid reviewedby user ID"),

  body("property").notEmpty().isMongoId().withMessage("Invalid property ID"),
];

exports.reviewByPropertyValidator = [
  param("id").isMongoId().withMessage("Invalid Property ID"),
];
