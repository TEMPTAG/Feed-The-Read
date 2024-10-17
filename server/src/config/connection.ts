// Import dotenv to load environment variables from the .env file
import dotenv from "dotenv";
// Load the environment variables from the .env file
dotenv.config();

// Import Mongoose to handle MongoDB connections
import mongoose from "mongoose";

// Get the MongoDB connection string from the environment variables or use a local MongoDB instance
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/googlebooks";

// Define an asynchronous function to connect to the MongoDB database
const db = async (): Promise<typeof mongoose.connection> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Database connected.");
    return mongoose.connection;
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Database connection failed.");
  }
};

// Export the db function for use in other parts of the application
export default db;
