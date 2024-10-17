// Import Mongoose for schema creation and types
import { Schema, type Document } from "mongoose";

// Define a TypeScript interface that extends Mongoose's Document interface to ensure the shape of a Book document
export interface BookDocument extends Document {
  authors: string[];
  description: string;
  title: string;
  bookId: string; // Unique ID for the book from Google Books API
  image: string;
  link: string;
}

// Define the schema for the Book model, specifying how each field should be structured
const bookSchema = new Schema<BookDocument>({
  // An array of author names for the book
  authors: [
    {
      type: String,
    },
  ],
  // Description of the book, required field
  description: {
    type: String,
    required: true,
  },
  // Title of the book, required field
  title: {
    type: String,
    required: true,
  },
  // Unique book ID from the Google Books API, required field
  bookId: {
    type: String,
    required: true,
  },
  // URL for the book's cover image (optional)
  image: {
    type: String,
  },
  // External link to the book's page (optional)
  link: {
    type: String,
  },
});

// Export the Book schema to use in the User model
export default bookSchema;
