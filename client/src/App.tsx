// Import the custom CSS file for styling
import "./App.css";
// Import Apollo Client libraries for connecting to the GraphQL server
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
// Import utility for setting headers with authentication tokens
import { setContext } from "@apollo/client/link/context";
// Import Outlet from React Router for nested routes
import { Outlet } from "react-router-dom";

// Import the Navbar component
import Navbar from "./components/Navbar";

// Create an HTTP link to connect to the GraphQL API endpoint
const httpLink = createHttpLink({
  uri: "/graphql", // The URI of the GraphQL server
});

// Set the authorization headers for every request
const authLink = setContext((_, { headers }) => {
  // Retrieve the JWT token from local storage and set the authorization header
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create an Apollo Client instance, combining the auth link and HTTP link
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          savedBooks: {
            merge(existing = [], incoming = []) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
});

// Define the main App component
function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

// Export the App component for use in other parts of the application
export default App;
