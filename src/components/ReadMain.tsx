// Main app, holds both the selection page and speech to text page
// holds state and all the app is below it in the component tree

import { useState } from "react";
import ReadCont from "./ReadCont";
import BookCont from "./BookCont";
import { books } from "./scripting/books";
import { setBook } from "./scripting/request";

const ReadMain = () => {
  // page transition
  const [transition, setTransition] = useState(false);
  // controls state of app, book selection/ speech detection
  const [appState, setAppState] = useState("Selection");

  // Transition app in a fade in fade out manner
  // takes future state in state variable, and id of book if one exisits
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

  //Two states select Book/ Speech detection
  return (
    <div className="readMain">
      {appState === "Selection" ? (
        <BookCont books={books} transition={startTransition} />
      ) : (
        <ReadCont startTransition={startTransition} />
      )}

      <div
        className="transition"
        style={{ opacity: transition ? 1 : 0, zIndex: transition ? 10 : -1 }}
      ></div>
    </div>
  );
};

export default ReadMain;
