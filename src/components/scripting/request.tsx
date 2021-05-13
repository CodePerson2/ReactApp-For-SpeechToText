import { book } from "../SingleBook";
declare var io: any;
var socket = io.connect("/");

type data = {
  file: {
    success: number;
    transcript: string;
  };
};

type phrase = {
  word: string;
  highlight: boolean;
  key: number;
  time: number;
  alreadySpoken: boolean;
  current: boolean;
};

export type phraseArr = phrase[];

export var originalPhrases: phraseArr = [];

export var phrases: phraseArr = [];

var speechLoc: number = 0;

export const setBook = (book: book) => {
  var newBook: string[] = book.paragraph.split(".");
  originalPhrases = [];
  speechLoc = 0;
  newBook = newBook.filter((w) => w !== "");
  var bookPeriod: string[] = [];

  for (let x = 0; x < newBook.length; x++) {
    let w: string[] = newBook[x].split(" ");
    for (let y = 0; y < w.length; y++) {
      bookPeriod.push(w[y]);
    }
    bookPeriod.push(".");
  }
  bookPeriod = bookPeriod.filter((w) => w !== "");

  var count: number = 0;
  var obj: phrase;

  bookPeriod.forEach((b) => {
    obj = {
      word: b,
      highlight: false,
      key: count,
      time: 0,
      alreadySpoken: false,
      current: count === 0,
    };
    count++;
    originalPhrases.push(obj);
  });

  phrases = JSON.parse(JSON.stringify(originalPhrases));
};

export const restartApp = () => {
  phrases = [];
  phrases = JSON.parse(JSON.stringify(originalPhrases));
  speechLoc = 0;

};

export const recieve = () => {
  return new Promise((res, rej) => {
    socket.on("audioText", (data: data) => {
      if (data.file.success === 1) {
        parseWords(data.file.transcript, res);
      } else {
        res(phrases);
      }
    });
  });
};

export const recieveOff = () => {
  socket.off("audioText", () => {
    console.log("socket is off");
  });
};

export const sendAudio = (audio: any) => {
  socket.emit("audio", {
    file: audio,
  });
};

const parseWords = (apiWords: string, res: any) => {
  var apiArr: string[] = apiWords.split(" ");

  var time = Date.now();
  var currentWord: { current: boolean } = { current: false };
  var lastWord: { current: boolean } = { current: false };
  var count: number = 0;

  phrases.forEach((p) => {
    if (p.current === true) lastWord = p;
    apiArr.forEach((a) => {
      if (
        !p.alreadySpoken &&
        p.word.toLowerCase() === a.toLowerCase() &&
        count > speechLoc - 2 &&
        count < speechLoc + 2
      ) {
        p.alreadySpoken = true;
        p.time = time;
        a = ""; //remove word
        if (lastWord.current === true) {
          lastWord.current = false;
          currentWord = p;
          currentWord.current = true;
          lastWord = currentWord;
          speechLoc = count;
        }
        return (p.highlight = true);
      }
    });
    if (p.word === "." && speechLoc === p.key - 1) {
      p.alreadySpoken = true;
      p.highlight = true
      p.time = time;
      speechLoc+=1;
    }
    count++;
  });

  setTimeout(() => {
    removeHighlight();
  }, 1600);
  res(phrases);
};

const removeHighlight = () => {
  phrases.forEach((p) => {
    if (p.highlight && p.time < Date.now() - 1500) {
      return (p.highlight = false);
    } else return;
  });
};
