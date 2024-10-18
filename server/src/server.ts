import express from "express";
import path from "node:path";
import type { Request, Response } from "express";
import db from "./config/connection.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./schemas/index.js";
import { authenticateToken } from "./utils/auth.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new Apollo Server instance with the provided typeDefs and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Function to start the Apollo Server and Express application, and connect to the database
const startApolloServer = async () => {
  await server.start();
  await db();

  // Set the port to the environment variable PORT, or 3001 if it's not set, and create a new Express application instance
  const PORT = process.env.PORT || 3001;
  const app = express();

  // Middleware to parse incoming request bodies in URL-encoded format and JSON format
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Apply Apollo Server's middleware to the /graphql endpoint, and attach the context (authentication) to every request to /graphql
  app.use(
    "/graphql",
    expressMiddleware(server as any, {
      context: authenticateToken as any,
    })
  );

  // Serve static assets in production mode (React frontend)
  if (process.env.NODE_ENV === "production") {
    // Serve the compiled frontend assets from the /dist directory
    app.use(express.static(path.join(__dirname, "../../client/dist")));

    // Route all unmatched requests to the frontend's index.html (for React Router to handle client-side routing)
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
    });
  }

  // Start the server and listen on the specified port
  app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

// Start the Apollo Server and Express application
startApolloServer();
