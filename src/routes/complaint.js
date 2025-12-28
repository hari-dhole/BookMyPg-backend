var express = require("express");
var router = express.Router();

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
const validate = require("../middlewares/validate");

router.get("/complaints/owner/:id", getComplaints);
router.get("/complaints/:id", getComplaintById);
router.post("/complaints", createComplaintValidator, validate, createComplaint);
router.put(
  "/complaints/:id",
  updateComplaintValidator,
  validate,
  updateComplaintStatus
);
