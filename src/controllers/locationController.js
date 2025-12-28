const Location = require("../models/location");
const apiResponse = require("../helpers/apiResponse");
const { getPagination } = require("../utils/pagination");

/* -------------------------------------------------------------------------- */
/*                            GET ALL LOCATIONS                                */
/* -------------------------------------------------------------------------- */
exports.getAllLocations = async (req, res) => {
  try {
    const { page, limit, skip, sort, sortMeta } = getPagination(req.query);

    const [locations, total] = await Promise.all([
      Location.find().sort(sort).skip(skip).limit(limit).lean(),
      Location.countDocuments(),
    ]);

    return apiResponse.successResponseWithData(
      res,
      {
        data: locations,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        sort: sortMeta,
      },
      total
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/*                             CREATE LOCATION                                 */
/* -------------------------------------------------------------------------- */
exports.createLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    return apiResponse.successResponseWithData(res, location);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};
