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
} = require("../validators/userValidator");

router.get("/", getAllUsers);
router.get("/owners/:id", getAllUsers);

router.get("/:id", userIdValidator, validate, getUserById);
router.get("/users/:email", emailValidator, validate, getUserByEmail);

router.post("/", createUserValidator, validate, createUser);

router.put("/:id", userIdValidator, validate, updateUser);

router.patch("/:id", userIdValidator, validate, toggleUserStatus);
router.delete("/:id", deleteUserById);

module.exports = router;
