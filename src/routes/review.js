const express = require("express");
const router = express.Router();

const {
  createReview,
  getAllReviews,
  getReviewByPropertyId,
} = require("../controllers/reviewController");
const validate = require("../middlewares/validate");
const {
  createReviewValidator,
  reviewByPropertyValidator,
} = require("../validators/reviewValidator");

router.get("/reviews", getAllReviews);

router.get(
  "/properties/:id/reviews",
  reviewByPropertyValidator,
  validate,
  getReviewByPropertyId
);

router.post("/reviews", createReviewValidator, validate, createReview);

module.exports = router;
