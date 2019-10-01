const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 3000;

const app = require("./app");
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(con => {
    console.log("Database Connection established");
  })
  .catch(err => {
    console.log("Oh, no! Something went wrong!");
  });






app.listen(port, function() {
  console.log(`Server @ 127.0.0.1:${port}`);
});
