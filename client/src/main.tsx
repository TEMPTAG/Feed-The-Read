// Import ReactDOM to render the application
import ReactDOM from "react-dom/client";
// Import functions for setting up client-side routing
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Import Bootstrap CSS for styling
import "bootstrap/dist/css/bootstrap.min.css";

// Import the App component, SearchBooks and SavedBooks pages to be rendered
import App from "./App.jsx";
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";

// Set up client-side routing using React Router's createBrowserRouter function
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <h1 className="display-2">Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <SearchBooks />,
      },
      {
        path: "/saved",
        element: <SavedBooks />,
      },
    ],
  },
]);

// Render the RouterProvider component, passing in the router configuration
ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
