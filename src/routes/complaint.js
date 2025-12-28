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
const auth = require("../middlewares/auth");
const { ROLE } = require("../../constants");

/**
 * PUBLIC ROUTE (No auth)
 */
router.post("/", createComplaintValidator, validate, createComplaint);

/**
 * Apply auth + owner restriction to ALL routes below
 */
router.use(auth.protect);
router.use(auth.restrictTo(ROLE.Owner));

/**
 * PROTECTED ROUTES (Owner only)
 */
router.get("/", createComplaintValidator, validate, getComplaints);
router.get("/owner/:id", getComplaints);
router.get("/:id", auth.protect, auth.restrictTo(ROLE.Owner), getComplaintById);
router.put("/:id", updateComplaintValidator, validate, updateComplaintStatus);

module.exports = router;
