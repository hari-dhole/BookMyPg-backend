const { body } = require("express-validator");

exports.createComplaintValidator = [
  body("description").trim().notEmpty().withMessage("Description is required"),
];

exports.updateComplaintValidator = [
  body("status").trim().notEmpty().withMessage("Status is required"),
];
