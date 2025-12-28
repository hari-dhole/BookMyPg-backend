const { body } = require("express-validator");
const Location = require("../models/location");

exports.createLocationValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name must be specified.")
    .isAlphanumeric()
    .withMessage("Name has non-alphanumeric characters.")
    .custom(async (value) => {
      const exists = await Location.findOne({ name: value });
      if (exists) {
        throw new Error("Location name already in use");
      }
    }),
];
