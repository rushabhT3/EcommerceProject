// controllers/categoryController.js
const User = require("../models/user");
const Category = require("../models/category");

const getCategories = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    const categories = await Category.findAndCountAll({
      limit,
      offset,
      include: {
        model: User,
        where: { id: req.user.id },
        required: false,
        attributes: ["id"], // Only get the user's id
        through: { attributes: [] }, // Don't get any attributes from the junction table
      },
    });

    const totalPages = Math.ceil(categories.count / limit);

    res.send({
      categories: categories.rows.map((category) => ({
        id: category.id,
        name: category.name,
        interested: category.Users.length > 0, // If the user is associated with the category, mark as interested
      })),
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    res.status(500).send("An error occurred while fetching categories.");
  }
};

const toggleInterest = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // Find the category
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).send("Category not found.");
    }

    // Check if the user is already interested in the category
    const isInterested = await req.user.hasCategory(category);

    if (isInterested) {
      // If the user is already interested, unmark the category
      await req.user.removeCategory(category);
    } else {
      // If the user is not interested, mark the category
      await req.user.addCategory(category);
    }

    res.send("Interest toggled successfully.");
  } catch (err) {
    res.status(500).send("An error occurred while toggling interest.");
  }
};

module.exports = { getCategories, toggleInterest };
