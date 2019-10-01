const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 3000;
const Tour = require("./models/tourModel");

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

const tours = fs.readFileSync("./dev-data/data/tours-simple.json", "utf-8");

const importData = async () => {
  try {
    await Tour.create(JSON.parse(tours));
    console.log("Data Sucesfully imported!");
    process.exit()
  } catch (error) {}
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Successfully Deleted");
    process.exit()
  } catch (error) {}
};

args = process.argv[2]

if(args == "--import"){
    importData()
}

if(args == "--delete"){
    deleteData()
}