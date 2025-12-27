const jwt = require("jsonwebtoken");
const apiResponse = require("../helpers/apiResponse");

exports.protect = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return apiResponse.unauthorizedResponse(res, "Missing Token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return apiResponse.unauthorizedResponse(res, "Invalid Token");
  }
};

exports.restrictTo = function (...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return apiResponse.validationErrorWithData(res, "Invalid user role");
    }
    next();
  };
};
