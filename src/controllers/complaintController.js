const Complaint = require("../models/complaint");
const Property = require("../models/property");
const apiResponse = require("../helpers/apiResponse");
const mongoose = require("mongoose");
const constants = require("../../constants");
const { getPagination } = require("../utils/pagination");

/**
 * Build complaint filter
 */
const buildComplaintFilter = async (query, ownerId) => {
  const filter = {};

  // Owner-based filtering
  if (ownerId) {
    const properties = await Property.find(
      { owner: ownerId },
      { _id: 1 }
    ).lean();

    filter.property = { $in: properties.map((p) => p._id) };
  }

  // Date filter
  if (query.from_date || query.to_date) {
    filter.createdAt = {};
    if (query.from_date) filter.createdAt.$gte = new Date(query.from_date);
    if (query.to_date) filter.createdAt.$lte = new Date(query.to_date);
  }

  // Property search
  if (query.search) {
    const properties = await Property.find(
      { name: { $regex: query.search, $options: "i" } },
      { _id: 1 }
    ).lean();

    filter.property = { $in: properties.map((p) => p._id) };
  }

  return filter;
};

/**
 * GET /complaints/owner/:id
 * Complaint list (Owner)
 */
exports.getComplaints = async (req, res) => {
  try {
    const ownerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return apiResponse.validationErrorWithData(res, "Invalid owner ID");
    }

    const { page, limit, skip, sort, sortMeta } = getPagination(req.query);
    const filter = await buildComplaintFilter(req.query, ownerId);

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate("property", constants.POPULATE_PROPERTY_FIELDS)
        .populate("raisedby", constants.POPULATE_USER_FIELDS)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Complaint.countDocuments(filter),
    ]);

    return apiResponse.successResponseWithData(res, {
      data: complaints,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      sort: sortMeta,
    });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/**
 * GET /complaints/:id
 * Complaint detail
 */
exports.getComplaintById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(res, "Invalid complaint ID");
    }

    const complaint = await Complaint.findById(req.params.id)
      .populate("property", constants.POPULATE_PROPERTY_FIELDS)
      .populate("raisedby", constants.POPULATE_USER_FIELDS)
      .lean();

    if (!complaint) {
      return apiResponse.notFoundResponse(res);
    }

    return apiResponse.successResponseWithData(res, complaint);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/**
 * POST /complaints
 * Create complaint
 */
exports.createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({
      description: req.body.description,
      raisedby: req.body.raisedby,
      property: req.body.property,
      remark: req.body.remark,
    });

    return apiResponse.successResponseWithData(res, complaint);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/**
 * PUT /complaints/:id
 * Update complaint status
 */
exports.updateComplaintStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(res, "Invalid complaint ID");
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!complaint) {
      return apiResponse.notFoundResponse(res);
    }

    return apiResponse.successResponseWithData(res, complaint);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};
