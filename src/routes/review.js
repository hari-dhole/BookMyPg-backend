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

router.get("/", getAllReviews);

router.get(
  "/property/:id",
  reviewByPropertyValidator,
  validate,
  getReviewByPropertyId,
);

router.post("/", createReviewValidator, validate, createReview);

module.exports = router;
