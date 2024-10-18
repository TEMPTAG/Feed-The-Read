import { Container, Card, Button, Row, Col } from "react-bootstrap";
import Auth from "../utils/auth";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";
import type { Book } from "../models/Book";

const SavedBooks = () => {
  // Use `useQuery` to get user data
  const { loading, data, refetch } = useQuery(GET_ME);

  // Set up `useMutation` for removing books
  const [removeBook] = useMutation(REMOVE_BOOK);

  // Get user data or fallback to empty object
  const userData = data?.me || {};

  // Create function to handle deleting a book
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId },
      });
      refetch(); // Refetch user data after deleting a book
    } catch (err) {
      console.error(err);
    }
  };

  // Show loading message while data is being fetched
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>
            {userData.username
              ? `Viewing ${userData.username}'s saved books!`
              : "Viewing saved books!"}
          </h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks?.map((book: Book) => (
            <Col md="4" key={book.bookId}>
              <Card border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image.replace("http://", "https://")}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors.join(", ")}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    href={book.link.replace("http://", "https://")}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                  >
                    Preview Book
                  </Button>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
