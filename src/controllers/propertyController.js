const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

const Property = require("../models/property");
const Location = require("../models/location");
const Review = require("../models/review");

const apiResponse = require("../helpers/apiResponse");
const constants = require("../../constants");
const { getPagination } = require("../utils/pagination");

const ObjectId = mongoose.Types.ObjectId;

/* -------------------------------------------------------------------------- */
/*                                FILTER BUILDER                               */
/* -------------------------------------------------------------------------- */
async function buildPropertyFilter(query, userId) {
  const filter = {};

  // Owner vs Public
  if (userId) {
    filter.owner = ObjectId(userId);
  } else {
    filter.isactive = true;
  }

  // Gender filter
  if (query.gender) {
    filter.gender = { $in: query.gender.split(",") };
  }

  // Rent filter
  if (query.rent) {
    filter.$or = query.rent.split(",").map((key) => ({
      rent: {
        $gte: constants.RENT_FILTER_CONVENTIONS[key].greater_than,
        $lte: constants.RENT_FILTER_CONVENTIONS[key].less_than,
      },
    }));
  }

  // Search
  if (query.search) {
    if (userId) {
      filter.name = { $regex: query.search, $options: "i" };
    } else {
      const location = await Location.findOne({ name: query.search });
      if (location) {
        filter.location = location._id;
      }
    }
  }

  // Rating filter
  if (query.rating) {
    const ratings = query.rating.split(",").map(Number);

    const rated = await Review.aggregate([
      { $group: { _id: "$property", avgRating: { $avg: "$rating" } } },
      { $match: { avgRating: { $in: ratings } } },
    ]);

    filter._id = { $in: rated.map((r) => r._id) };
  }

  return filter;
}

/* -------------------------------------------------------------------------- */
/*                            REVIEW ANALYSIS HELPER                           */
/* -------------------------------------------------------------------------- */
async function getReviewAnalysis(propertyId) {
  const reviews = await Review.find({ property: propertyId }).populate(
    "reviewedby",
    constants.POPULATE_USER_FIELDS,
  );

  if (!reviews.length) {
    return {};
  }

  const total = reviews.length;

  const [analysis] = await Review.aggregate([
    { $match: { property: ObjectId(propertyId) } },
    {
      $facet: {
        review_percentage: [
          { $group: { _id: "$rating", count: { $sum: 1 } } },
          {
            $project: {
              rating: "$_id",
              percentage: {
                $round: [
                  { $multiply: [{ $divide: ["$count", total] }, 100] },
                  2,
                ],
              },
            },
          },
        ],
        avg_ratings: [
          { $group: { _id: null, avg: { $avg: "$rating" } } },
          { $project: { avg: { $round: ["$avg", 2] } } },
        ],
      },
    },
  ]);

  return {
    reviews,
    reviewanalysis: analysis.review_percentage,
    avgratings: analysis.avg_ratings[0]?.avg || 0,
  };
}

/* -------------------------------------------------------------------------- */
/*                               PROPERTY LIST                                 */
/* -------------------------------------------------------------------------- */
exports.getAllProperties = async (req, res) => {
  try {
    const { page, limit, skip, sort, sortMeta } = getPagination(req.query);

    const userId = req.route.path.includes("owner") ? req.params.id : null;
    const filter = await buildPropertyFilter(req.query, userId);

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .populate("location", constants.POPULATE_LOCATION_FIELDS)
        .populate("amenities", constants.POPULATE_AMENITY_FIELDS)
        .populate("owner", constants.POPULATE_USER_FIELDS)
        .populate("numreviews")
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Property.countDocuments(filter),
    ]);

    const propertiesRes = await Promise.all(
      properties.map(async (property) => ({
        propertydata: property,
        reviewdata: await getReviewAnalysis(property._id),
      })),
    );

    return apiResponse.successResponseWithData(
      res,
      {
        data: propertiesRes,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        sort: sortMeta,
      },
      total,
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/*                              PROPERTY DETAIL                                */
/* -------------------------------------------------------------------------- */
exports.getPropertyById = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return apiResponse.validationErrorWithData(res, "Invalid ID");
  }

  try {
    const property = await Property.findById(req.params.id)
      .populate("location", constants.POPULATE_LOCATION_FIELDS)
      .populate("amenities", constants.POPULATE_AMENITY_FIELDS)
      .populate("owner", constants.POPULATE_USER_FIELDS)
      .populate("numreviews");

    if (!property) {
      return apiResponse.notFoundResponse(res);
    }

    const reviewdata = await getReviewAnalysis(property._id);

    return apiResponse.successResponseWithData(res, {
      propertydata: property,
      reviewdata,
    });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/*                               PROPERTY STORE                                */
/* -------------------------------------------------------------------------- */
exports.createProperty = [
  body("name").notEmpty().withMessage("Name is required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("description").notEmpty().withMessage("Description is required"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(res, errors.array());
    }

    try {
      const property = await Property.create(req.body);
      return apiResponse.successResponseWithData(res, property);
    } catch (error) {
      return apiResponse.ErrorResponse(res, error);
    }
  },
];

/* -------------------------------------------------------------------------- */
/*                           PROPERTY ENABLE / DISABLE                          */
/* -------------------------------------------------------------------------- */
exports.deletePropertyById = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return apiResponse.validationErrorWithData(res, "Invalid ID");
  }

  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return apiResponse.notFoundResponse(res);
    }

    property.isactive = !property.isactive;
    await property.save();

    return apiResponse.successResponseWithData(res, property);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/*                               PROPERTY UPDATE                               */
/* -------------------------------------------------------------------------- */
exports.updatePropertyById = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return apiResponse.validationErrorWithData(res, "Invalid ID");
  }

  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!property) {
      return apiResponse.notFoundResponse(res);
    }

    return apiResponse.successResponseWithData(res, property);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};
