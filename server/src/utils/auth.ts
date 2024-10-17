import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import dotenv from "dotenv";
dotenv.config();

// Function to authenticate a token (used in context for GraphQL requests)
export const authenticateToken = ({ req }: any) => {
  // Get the token from the request headers, query, or body
  let token = req.body.token || req.query.token || req.headers.authorization;

  // If the token is in the headers, remove the "Bearer " prefix
  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }

  // If there is no token, return the request as is
  if (!token) {
    return req;
  }

  try {
    const { data }: any = jwt.verify(token, process.env.JWT_SECRET_KEY || "", {
      maxAge: "2hr", // 2 hour expiration time for the Token
    });
    req.user = data; // Set the user data from the token to the request object
  } catch (err) {
    console.log("Invalid token"); // Log an error if the token is invalid
  }

  // Return the request object with the user data attached if authenticated, or the request object as is if not authenticated
  return req;
};

// Function to sign a token with a username, email, and _id
export const signToken = (username: string, email: string, _id: unknown) => {
  // Create a payload with the username, email, and _id
  const payload = { username, email, _id };
  const secretKey: any = process.env.JWT_SECRET_KEY; // Get the secret key from the environment variables

  // Return a signed token with the payload and secret key
  return jwt.sign({ data: payload }, secretKey, { expiresIn: "2h" });
};

// Custom error class for authentication errors
export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ["UNAUTHENTICATED"]);
    Object.defineProperty(this, "name", { value: "AuthenticationError" });
  }
}
