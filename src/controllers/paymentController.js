const Payment = require("../models/payment");
const apiResponse = require("../helpers/apiResponse");
const templateText = require("../helpers/templateText");
const mailer = require("../helpers/mailer");
const constants = require("../constants");
const { buildPaymentFilter } = require("../services/paymentService");

exports.createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);

    const emailPayload = templateText.paymentTemplate(req.body);
    await mailer.send(payment.email, req.body.owneremail, emailPayload);

    return apiResponse.successResponseWithData(res, payment);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: order === "asc" ? 1 : -1 };

    const filter = await buildPaymentFilter(req.query, req.params.id);

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate("property", constants.POPULATE_PROPERTY_FIELDS)
        .populate("raisedby", constants.POPULATE_USER_FIELDS)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      Payment.countDocuments(filter),
    ]);

    return apiResponse.successResponseWithData(res, payments, total);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};
