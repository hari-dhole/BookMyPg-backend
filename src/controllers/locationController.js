const Location = require("../models/location");
const apiResponse = require("../helpers/apiResponse");
const { getPagination } = require("../utils/pagination");

async function buildLocationFilter(query) {
  const filter = {};

  // Active status filter
  if (query.isactive !== undefined) {
    filter.isactive = query.isactive === "true";
  }

  // Search by name
  if (query.search) {
    filter.name = {
      $regex: query.search,
      $options: "i",
    };
  }

  // Date range filter
  if (query.from_date || query.to_date) {
    filter.createdAt = {};
    if (query.from_date) {
      filter.createdAt.$gte = new Date(query.from_date);
    }
    if (query.to_date) {
      filter.createdAt.$lte = new Date(query.to_date);
    }
  }

  return filter;
}

/* -------------------------------------------------------------------------- */
/*                            GET ALL LOCATIONS                                */
/* -------------------------------------------------------------------------- */
exports.getAllLocations = async (req, res) => {
  try {
    const { page, limit, skip, sort, sortMeta } = getPagination(req.query);
    const filter = buildLocationFilter(req.query);

    const [locations, total] = await Promise.all([
      Location.find(filter).sort(sort).skip(skip).limit(limit).lean(),
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
