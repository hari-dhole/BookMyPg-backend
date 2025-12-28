const express = require("express");
const router = express.Router();

const { sendEmail } = require("../controllers/emailController");
const { sendEmailValidator } = require("../validators/emailValidator");
const validate = require("../middlewares/validate");

router.post("/", sendEmailValidator, validate, sendEmail);

module.exports = router;
