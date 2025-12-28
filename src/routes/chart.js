const express = require("express");
const router = express.Router();
const { getComplaintChartData } = require("../controllers/chartsController");

// Owner complaints chart
router.get("/owner/:id/complaints", getComplaintChartData);

// Admin complaints chart
router.get("/admin/:id/complaints", getComplaintChartData);

module.exports = router;
