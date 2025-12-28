var express = require("express");
var {
  createComplaint,
  getComplaintById,
  getComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController");
const {
  updateComplaintValidator,
  createComplaintValidator,
} = require("../validators/complaintValidator");
const { validate } = require("../middlewares/validate");

var router = express.router();

router.get("/complaints/owner/:id", getComplaints);
router.get("/complaints/:id", getComplaintById);
router.post("/complaints", createComplaintValidator, validate, createComplaint);
router.put(
  "/complaints/:id",
  updateComplaintValidator,
  validate,
  updateComplaintStatus
);
