const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  verify,
  markCategory,
} = require("./controllers/controller");

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify", verify);
router.post("/mark-category", markCategory);

module.exports = router;
