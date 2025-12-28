const express = require("express");
const router = express.Router();

const {
  createPayment,
  getAllPayments,
} = require("../controllers/paymentController");
const { createPaymentValidator } = require("../validators/paymentValidator");
const validate = require("../middlewares/validate");

router.post("/payments", createPaymentValidator, validate, createPayment);

router.get("/payments/:id?", getAllPayments);

module.exports = router;
