import { useState } from "react";
import type { FormEvent } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client";
import { SAVE_BOOK } from "../utils/mutations";
import { GET_ME } from "../utils/queries";
import Auth from "../utils/auth";
import { searchGoogleBooks } from "../utils/API";
import type { Book } from "../models/Book";
import type { GoogleAPIBook } from "../models/GoogleAPIBook";

const SearchBooks = () => {
  // State for holding returned Google API data
  const [searchedBooks, setSearchedBooks] = useState<Book[]>([]);
  // State for holding the search input value
  const [searchInput, setSearchInput] = useState("");

  // Apollo `useMutation` hook for the `SAVE_BOOK` mutation
  const [saveBook, { error: saveBookError }] = useMutation(SAVE_BOOK, {
    refetchQueries: [{ query: GET_ME }],
  });

  if (saveBookError) {
    console.log(JSON.stringify(saveBookError));
  }

  // Apollo `useQuery` hook to retrieve the user's saved books
  const { data: userData } = useQuery(GET_ME);
  const savedBooks = userData?.me?.savedBooks || [];

  // Function to handle searching books using Google API
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const { items } = await response.json();

      const bookData = items.map((book: GoogleAPIBook) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ["No author available"],
        title: book.volumeInfo.title || "No title available",
        description: book.volumeInfo.description || "No description available",
        image: book.volumeInfo.imageLinks?.thumbnail
          ? book.volumeInfo.imageLinks.thumbnail.replace("http://", "https://")
          : "",
        link: book.volumeInfo.previewLink
          ? book.volumeInfo.previewLink.replace("http://", "https://")
          : "#",
      }));

      setSearchedBooks(bookData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle saving a book to the user's saved books
  const handleSaveBook = async (bookId: string) => {
    // Find the book in `searchedBooks` state by matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId)!;

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveBook({
        variables: { input: bookToSave },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : "Search for a book to begin"}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            const alreadySaved = savedBooks.some(
              (savedBook: Book) => savedBook.bookId === book.bookId
            );

            return (
              <Col md="4" key={book.bookId}>
                <Card border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors.join(", ")}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      href={book.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="primary"
                    >
                      Preview Book
                    </Button>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={alreadySaved}
                        className="btn-block btn-info"
                        onClick={() => handleSaveBook(book.bookId)}
                      >
                        {alreadySaved
                          ? "This book has already been saved!"
                          : "Save this Book!"}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
