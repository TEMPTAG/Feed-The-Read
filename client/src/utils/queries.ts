import { gql } from "@apollo/client";

// Define the `me` query to get the authenticated user's information
export const GET_ME = gql`
  query getMe {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;
