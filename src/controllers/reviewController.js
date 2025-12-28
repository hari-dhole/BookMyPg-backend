const mongoose = require("mongoose");
const Review = require("../models/review");
const apiResponse = require("../helpers/apiResponse");
const constants = require("../../constants");

const ObjectId = mongoose.Types.ObjectId;

/* -------------------------------------------------------------------------- */
/*                               REVIEW LIST                                   */
/* -------------------------------------------------------------------------- */
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("property", constants.POPULATE_PROPERTY_FIELDS)
      .populate("reviewedby", constants.POPULATE_USER_FIELDS);

    return apiResponse.successResponseWithData(res, reviews);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/*                        REVIEW LIST BY PROPERTY ID                            */
/* -------------------------------------------------------------------------- */
exports.getReviewByPropertyId = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    return apiResponse.validationErrorWithData(res, "Invalid Property ID");
  }

  try {
    const reviews = await Review.find({ property: req.params.id })
      .populate("property", constants.POPULATE_PROPERTY_FIELDS)
      .populate("reviewedby", constants.POPULATE_USER_FIELDS);

    return apiResponse.successResponseWithData(res, reviews);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/*                               REVIEW CREATE                                 */
/* -------------------------------------------------------------------------- */
exports.createReview = async (req, res) => {
  try {
    const review = await Review.create({
      rating: req.body.rating,
      description: req.body.description,
      reviewedby: req.body.reviewedby,
      property: req.body.property,
    });

    return apiResponse.successResponseWithData(res, review);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};
