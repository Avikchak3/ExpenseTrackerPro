const Category =
  require("../models/Category");


// ADD CATEGORY
const addCategory =
  async (req, res) => {

    try {

      const { name, color } =
        req.body;

      const category =
        await Category.create({

          userId: req.user.id,

          name,

          color,
        });

      res.status(201).json({
        success: true,
        message:
          "Category added successfully",
        category,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };


// GET CATEGORIES
const getCategories =
  async (req, res) => {

    try {

      const categories =
        await Category.find({

          userId: req.user.id,
        });

      res.status(200).json({
        success: true,
        categories,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });
    }
  };


module.exports = {
  addCategory,
  getCategories,
};