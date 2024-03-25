// routes/router.js
const express = require("express");
const router = express.Router();

const { signup, login, verify } = require("../controllers/authController");
const {
  toggleInterest,
  getCategories,
} = require("../controllers/categoryController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify", verify);
router.post("/toggle-interest", toggleInterest);
router.get("/categories", getCategories);

module.exports = router;
