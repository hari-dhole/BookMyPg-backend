const Amenity = require("../models/amenity");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require("mongoose");

/**
 * GET /amenities
 * List amenities with search, pagination & sorting
 */
exports.getAllAmenities = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim();

    // Safe sorting
    const allowedSortFields = ["name", "createdAt", "updatedAt"];
    const sortBy = allowedSortFields.includes(req.query.sortBy)
      ? req.query.sortBy
      : "createdAt";

    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Filters
    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const [amenities, total] = await Promise.all([
      Amenity.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Amenity.countDocuments(filter),
    ]);

    return apiResponse.successResponseWithData(res, {
      data: amenities,
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
 * GET /amenities/:id
 * Get amenity details
 */
exports.getAmenityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse.validationErrorWithData(res, "Invalid amenity ID");
    }

    const amenity = await Amenity.findById(id).lean();

    if (!amenity) {
      return apiResponse.notFoundResponse(res);
    }

    return apiResponse.successResponseWithData(res, amenity);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/**
 * POST /amenities
 * Create amenity
 */
exports.createAmenity = async (req, res) => {
  try {
    const { name, logo, isactive = true } = req.body;

    const amenity = await Amenity.create({
      name,
      logo,
      isactive,
    });

    return apiResponse.successResponseWithData(res, amenity);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/**
 * PUT /amenities/:id
 * Update amenity
 */
exports.updateAmenity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse.validationErrorWithData(res, "Invalid amenity ID");
    }

    const amenity = await Amenity.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!amenity) {
      return apiResponse.notFoundResponse(res);
    }

    return apiResponse.successResponseWithData(res, amenity);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/**
 * PATCH /amenities/:id/toggle
 * Enable / Disable amenity
 */
exports.toggleAmenityStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return apiResponse.validationErrorWithData(res, "Invalid amenity ID");
    }

    const amenity = await Amenity.findById(id);

    if (!amenity) {
      return apiResponse.notFoundResponse(res);
    }

    amenity.isactive = !amenity.isactive;
    await amenity.save();

    return apiResponse.successResponseWithData(res, amenity);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};
