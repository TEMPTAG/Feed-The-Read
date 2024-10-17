// Import Mongoose for schema/model creation and types
import { Schema, model, type Document } from "mongoose";
// Import bcrypt for hashing and comparing passwords
import bcrypt from "bcrypt";

// Import the Book schema to store saved books within the User model
import bookSchema from "./Book.js";
// Import the type definition for Book documents
import type { BookDocument } from "./Book.js";

// Define a TypeScript interface that extends the Mongoose Document interface to include custom fields/methods for the User model
export interface UserDocument extends Document {
  id: string;
  username: string;
  email: string;
  bookCount: number;
  savedBooks: BookDocument[];
  password: string;
  isCorrectPassword(password: string): Promise<boolean>;
}

// Define the User schema with fields for username, email, password, and savedBooks
const userSchema = new Schema<UserDocument>(
  {
    // The username field, which is required and must be unique
    username: {
      type: String,
      required: true,
      unique: true,
    },
    // The email field, which is required, must be unique, and must match a valid email format
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    // The password field, which is required
    password: {
      type: String,
      required: true,
    },
    // An array of saved books, each book follows the Book schema
    savedBooks: [bookSchema],
  },
  {
    // Enable virtual fields to be included in JSON responses
    toJSON: {
      virtuals: true,
    },
  }
);

// Middleware to hash the user's password before saving it to the database
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// Method to compare the entered password with the stored hashed password
userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Virtual field to count the number of saved books
userSchema.virtual("bookCount").get(function () {
  return this.savedBooks.length;
});

// Create the User model based on the userSchema and export it
const User = model<UserDocument>("User", userSchema);

export default User;
