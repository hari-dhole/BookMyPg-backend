const { body, param } = require("express-validator");
const User = require("../models/user");

exports.createUserValidator = [
  body("firstName").notEmpty().isAlphanumeric(),
  body("lastName").notEmpty().isAlphanumeric(),
  body("email")
    .isEmail()
    .custom(async (email) => {
      const exists = await User.findOne({ email });
      if (exists) {throw new Error("Email already in use");}
    }),
];

exports.userIdValidator = [
  param("id").isMongoId().withMessage("Invalid User ID"),
];

exports.emailValidator = [
  param("email").isEmail().withMessage("Invalid Email"),
];
