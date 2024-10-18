// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query: string) => {
  const apiKey = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;
  return fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`
  );
};
