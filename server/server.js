const express = require("express");
const router = require("./routes/router");
const sequelize = require("./database/index");
const app = express();
const port = 3000;

app.use(express.json());
app.use("/", router);

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
