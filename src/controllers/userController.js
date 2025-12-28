const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const apiResponse = require("../helpers/apiResponse");
const constants = require("../../constants");

async function buildUserFilter(query, ownerId = null) {
  const filter = {};

  if (ownerId) {
    const properties = await Property.find({ owner: ownerId }, { _id: 1 });
    filter.property = { $in: properties.map((p) => p._id) };
  }

  if (query.type) {
    filter.role = query.type;
  }

  if (query.from_date || query.to_date) {
    const dateFilter = {};
    if (query.from_date) {dateFilter.$gte = new Date(query.from_date);}
    if (query.to_date) {dateFilter.$lte = new Date(query.to_date);}

    filter[ownerId ? "onboardedAt" : "createdAt"] = dateFilter;
  }

  if (query.search) {
    filter.$expr = {
      $regexMatch: {
        input: { $concat: ["$firstName", " ", "$lastName"] },
        regex: query.search,
        options: "i",
      },
    };
  }

  return filter;
}

/* -------------------------------------------------------------------------- */
/*                                USER LIST                                   */
/* -------------------------------------------------------------------------- */
exports.getAllUsers = async (req, res) => {
  try {
    const ownerId = req.route.path.includes("owner") ? req.params.id : null;

    const filter = await buildUserFilter(req.query, ownerId);
    const { page, skip, limit, sort, sortMeta } = getPagination(req.query);

    const [users, total] = await Promise.all([
      User.find(filter)
        .populate("property", constants.POPULATE_PROPERTY_FIELDS)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    return apiResponse.successResponseWithData(
      res,
      {
        data: users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        sort: sortMeta,
      },
      total,
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/*                              USER DETAIL                                   */
/* -------------------------------------------------------------------------- */
exports.getUserById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return apiResponse.validationErrorWithData(res, "Invalid User ID");
  }

  try {
    const user = await User.findById(req.params.id).populate(
      "property",
      constants.POPULATE_PROPERTY_FIELDS,
    );

    return user
      ? apiResponse.successResponseWithData(res, user)
      : apiResponse.notFoundResponse(res);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/*                          USER DETAIL BY EMAIL                               */
/* -------------------------------------------------------------------------- */
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).populate(
      "property",
      constants.POPULATE_PROPERTY_FIELDS,
    );

    if (!user) {return apiResponse.notFoundResponse(res);}

    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
    );

    return apiResponse.successResponseWithData(res, {
      ...user.toObject(),
      token,
    });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/*                                CREATE USER                                 */
/* -------------------------------------------------------------------------- */
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return apiResponse.successResponseWithData(res, user);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/*                              UPDATE USER                                   */
/* -------------------------------------------------------------------------- */
exports.updateUser = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return apiResponse.validationErrorWithData(res, "Invalid User ID");
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return user
      ? apiResponse.successResponseWithData(res, user)
      : apiResponse.notFoundResponse(res);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/*                           TOGGLE USER STATUS                                */
/* -------------------------------------------------------------------------- */
exports.toggleUserStatus = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return apiResponse.validationErrorWithData(res, "Invalid User ID");
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {return apiResponse.notFoundResponse(res);}

    user.isactive = !user.isactive;
    await user.save();

    return apiResponse.successResponseWithData(res, user);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/*                              USER DELETE                                   */
/* -------------------------------------------------------------------------- */
exports.deleteUserById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return apiResponse.validationErrorWithData(res, "Invalid User ID");
  }

  try {
    const user = await User.deleteOne({ id: req.params.id });
    return apiResponse.successResponseWithData(res, user);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};
