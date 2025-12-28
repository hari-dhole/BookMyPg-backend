const apiResponse = require("../helpers/apiResponse");
const templateText = require("../helpers/templateText");
const mailer = require("../helpers/mailer");
const constants = require("../../constants");

/**
 * POST /email/send
 * Send email based on template type
 */
exports.sendEmail = async (req, res) => {
  try {
    const { type, email, useremail, owneremail } = req.body;

    const templateKey = constants.EMAIL_TEMPLATE_TEXT[type];

    if (!templateKey || !templateText[templateKey]) {
      return apiResponse.validationErrorWithData(
        res,
        "Invalid email template type",
      );
    }

    // Generate email content
    const emailPayload = templateText[templateKey](req.body);

    // Send email
    await mailer.send(useremail || email, owneremail, emailPayload);

    return apiResponse.successResponseWithData(res, {
      message: "Email sent successfully",
      type,
    });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};
