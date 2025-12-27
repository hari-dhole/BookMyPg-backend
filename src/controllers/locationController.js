const Location = require("../models/location");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");

/**
 * Get all locations with pagination & sorting
 * @route GET /locations
 */
exports.getAllLocations = async (req, res) => {
  try {
    // Query params with defaults
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    // Fetch data
    const [locations, total] = await Promise.all([
      Location.find()
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Location.countDocuments(),
    ]);

    // Response payload
    return apiResponse.successResponseWithData(res, {
      data: locations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      sort: {
        sortBy,
        sortOrder: sortOrder === 1 ? "asc" : "desc",
      },
    });
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
