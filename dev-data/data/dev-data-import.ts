import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import Tour from "../../models/tourModel";
import Review from "../../models/reviewModel";
import User from "../../models/userModel";

dotenv.config({ path: "./config.env" });

const URL: string = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(URL).then(() => console.log("connected to DB successfully"));
// Import tour data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
// Data Insertion to your db

const importData = async () => {
  try {
    console.log("Importing all your docs...");
    await Tour.create(tours, { validateBeforeSave: false });
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews, { validateBeforeSave: false });
    console.log("Data Loaded Successfully");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    console.log("Deleting all your docs...");
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data Deleted Successfully");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const scriptType = process?.argv[2]?.replace("--", "");
const options = {
  import: importData,
  delete: deleteData,
};

if (options[scriptType]) options[scriptType]();
