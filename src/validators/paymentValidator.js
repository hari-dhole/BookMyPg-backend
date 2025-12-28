const { body } = require("express-validator");

exports.createPaymentValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("charge_id").notEmpty().withMessage("Charge ID is required"),
  body("raisedby").notEmpty().withMessage("RaisedBy is required"),
  body("amount").isNumeric().withMessage("Amount must be a number"),
];
