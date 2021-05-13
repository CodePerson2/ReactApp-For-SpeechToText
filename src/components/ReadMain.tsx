import React from "react";
import { useState } from "react";
import ReadCont from "./ReadCont";
import BookCont from "./BookCont";
import { books } from "./scripting/books";
import { setBook } from "./scripting/request";
import { createContext } from "react";

const ReadMain = () => {
  const [transition, setTransition] = useState(false);
  const [appState, setAppState] = useState("Selection");

  const startTransition = (state: string, id: number = -1) => {
    setTransition(true);

    setTimeout(() => {
      setAppState(state);

      if (state === "Reading") {
        var b: any = books.filter((b) => b.keyVal === id);
        setBook(b[0]);
      }
      setTimeout(() => {
        setTransition(false);
      }, 300);
    }, 300);
  };

  return (
    <div className="readMain">
      {appState === "Selection" ? (
        <BookCont books={books} transition={startTransition} />
      ) : (
        <ReadCont startTransition={startTransition}/>
      )}

      <div
        className="transition"
        style={{ opacity: transition ? 1 : 0, zIndex: transition ? 10 : -1 }}
      ></div>
    </div>
  );
};

export default ReadMain;
