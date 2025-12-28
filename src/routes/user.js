const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  toggleUserStatus,
  updateUser,
} = require("../controllers/userController");
const validate = require("../middlewares/validate");
const {
  createUserValidator,
  userIdValidator,
  emailValidator,
} = require("../validators/user.validator");

router.get("/users", getUsers);
router.get("/owners/:id/users", getUsers);

router.get("/users/:id", userIdValidator, validate, getUserById);
router.get("/users/email/:email", emailValidator, validate, getUserByEmail);

router.post("/users", createUserValidator, validate, createUser);

router.put("/users/:id", userIdValidator, validate, updateUser);

router.patch("/users/:id/toggle", userIdValidator, validate, toggleUserStatus);

module.exports = router;
