// Selection page for the books
// imports books.tsx to get the book objects

import SingleBook from "./SingleBook";
import { book } from "./SingleBook";

const BookCont = ({ books, transition }: any) => {
  return (
    <div>
      <div className="bookIntro">
        Pick a book, then practice your pronunciation on a paragraph from the
        book.
      </div>
      <div className="bookCont">
        {books.map((p: book) => {
          return (
            <SingleBook
              book={p}
              key={p.key}
              transition={transition}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BookCont;
