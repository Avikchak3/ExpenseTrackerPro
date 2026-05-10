const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const categoryController =
  require("../controllers/categoryController");


// ADD CATEGORY
router.post(
  "/",
  protect,
  categoryController.addCategory
);


// GET CATEGORIES
router.get(
  "/",
  protect,
  categoryController.getCategories
);


module.exports = router;