const Property = require("../models/property");

exports.buildUserFilter = async (query, ownerId = null) => {
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
    if (query.from_date) dateFilter.$gte = new Date(query.from_date);
    if (query.to_date) dateFilter.$lte = new Date(query.to_date);

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
};

exports.getPagination = (query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(parseInt(query.limit) || 10, 100);
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const order = query.order === "asc" ? 1 : -1;

  return { skip, limit, sort: { [sortBy]: order } };
};
