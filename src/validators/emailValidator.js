const { body } = require("express-validator");

exports.sendEmailValidator = [
  body("email").optional().isEmail().withMessage("Valid email is required"),

  body("type").trim().notEmpty().withMessage("Email type is required"),
];
