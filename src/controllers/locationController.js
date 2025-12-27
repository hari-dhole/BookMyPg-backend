const Location = require("../models/location");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");

/**
 * Get all locations
 * @route GET /locations
 */
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().lean();
    return apiResponse.successResponseWithData(res, locations);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/**
 * Create a new location
 * @route POST /locations
 */
exports.createLocation = [
  // Validation
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name must be specified.")
    .isAlphanumeric()
    .withMessage("Name has non-alphanumeric characters.")
    .custom(async (value) => {
      const location = await Location.findOne({ name: value });
      if (location) {
        throw new Error("Location name already in use");
      }
    })
    .escape(),

  // Controller
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(res, errors.array());
      }

      const { name, isactive } = req.body;

      const location = new Location({
        name,
        isactive,
      });

      await location.save();

      return apiResponse.successResponseWithData(res, location);
    } catch (error) {
      return apiResponse.ErrorResponse(res, error);
    }
  },
];
