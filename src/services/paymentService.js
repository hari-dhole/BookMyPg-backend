const Property = require("../models/property");

exports.buildPaymentFilter = async (query, userId) => {
  const filter = {};

  if (userId) {
    filter.raisedby = userId;
  }

  if (query.from_date || query.to_date) {
    filter.createdAt = {};
    if (query.from_date) {filter.createdAt.$gte = new Date(query.from_date);}
    if (query.to_date) {filter.createdAt.$lte = new Date(query.to_date);}
  }

  if (query.search) {
    const properties = await Property.find(
      { name: { $regex: query.search, $options: "i" } },
      { _id: 1 },
    );

    filter.property = { $in: properties.map((p) => p._id) };
  }

  return filter;
};
