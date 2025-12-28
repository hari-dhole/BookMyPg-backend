const mongoose = require("mongoose");
const Complaint = require("../models/complaint");
const apiResponse = require("../helpers/apiResponse");

function buildComplaintFilter(query, userId, role) {
  const filter = {};

  if (userId && role === "owner") {
    filter.raisedby = new mongoose.Types.ObjectId(userId);
  }

  if (query.from_date || query.to_date) {
    filter.createdAt = {};
    if (query.from_date) {
      filter.createdAt.$gte = new Date(query.from_date);
    }
    if (query.to_date) {
      filter.createdAt.$lte = new Date(query.to_date);
    }
  }

  if (query.status) {
    filter.status = query.status;
  }

  return filter;
}

/* -------------------------------------------------------------------------- */
/*                            COMPLAINT CHART DATA                             */
/* -------------------------------------------------------------------------- */
exports.getComplaintChartData = async (req, res) => {
  try {
    const isOwner = req.route.path.includes("owner");
    const isAdmin = req.route.path.includes("admin");

    const userId = isOwner || isAdmin ? req.params.id : null;
    const role = isOwner ? "owner" : "admin";

    const filter = buildComplaintFilter(req.query, userId, role);

    const count = await Complaint.countDocuments(filter);

    return apiResponse.successResponseWithData(res, {
      totalComplaints: count,
      filter,
    });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};
