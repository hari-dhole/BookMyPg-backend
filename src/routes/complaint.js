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

router.get("/", createComplaintValidator, validate, getComplaints);
router.get("/owner/:id", getComplaints);
router.get("/:id", getComplaintById);
router.post("/", createComplaintValidator, validate, createComplaint);
router.put("/:id", updateComplaintValidator, validate, updateComplaintStatus);
