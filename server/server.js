const express = require("express");
const { faker } = require("@faker-js/faker");
const cors = require("cors");
const app = express();
const port = 4000;

const router = require("./routes/router");
const sequelize = require("./database/index");
const User = require("./models/user");
const Category = require("./models/category");

User.belongsToMany(Category, { through: "UserCategories" });
Category.belongsToMany(User, { through: "UserCategories" });

const corsOptions = {
  origin: "*",
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/", router);

// to populate the categories table
// const populateCategories = async () => {
//   for (let i = 0; i < 100; i++) {
//     await Category.create({ name: faker.commerce.department() });
//   }
// };

sequelize
  .sync()
  .then(async () => {
    // await populateCategories();
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
