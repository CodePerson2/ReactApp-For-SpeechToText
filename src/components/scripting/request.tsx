import { book } from "../SingleBook";
declare var io: any;

// Use Socket.io at '/' in node server
var socket = io.connect("/");

// Type used for recieving data from node server
type data = {
  file: {
    success: number;
    transcript: string;
  };
};

// Each Word Object definition for the words spoken
type phrase = {
  word: string;
  highlight: boolean;
  key: number;
  time: number;
  alreadySpoken: boolean;
  current: boolean;
};

// Array of word objects
export type phraseArr = phrase[];

// Array of word objects used as the basis and will be left untouched
export var originalPhrases: phraseArr = [];

// Array of word objects and will be changed as user speaks
export var phrases: phraseArr = [];

// last phrase recieved from node server
var lastAPIPhrase: string = "";

// Location of speaker in paragraph
var speechLoc: number = 0;

// Function sets the book selected into the paragraph
// Splits phrase

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

  // Pushes book object into array
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

// resets values from the script
export const restartApp = () => {
  phrases = [];
  phrases = JSON.parse(JSON.stringify(originalPhrases));
  speechLoc = 0;

};

// recieves data from server and returns a promise
export const recieve = () => {
  return new Promise((res, rej) => {
    socket.on("audioText", (data: data) => {
      removeHighlight();
      if (data.file.success === 1) {

        // parse phrase if words are returned
        parseWords(data.file.transcript, res);
      } else {
        res(phrases);
      }
    });
  });
};

// Turn socket off
export const recieveOff = () => {
  socket.off("audioText", () => {
    console.log("socket is off");
  });
};

// Send audio function
export const sendAudio = (audio: any) => {
  socket.emit("audio", {
    file: audio,
  });
};

// Takes phrases recieved from Googles Speech-To-Text API and parses it for common words and structure
// Takes the 'string' and a 'result' promise
const parseWords = (apiWords: string, res: any) => {

  if(apiWords === lastAPIPhrase) return;
  lastAPIPhrase = apiWords;

  var apiArr: string[] = apiWords.split(" ");

  var time = Date.now();
  var currentWord: { current: boolean } = { current: false };
  var lastWord: { current: boolean } = { current: false };
  var count: number = 0;

  // iterates through the words in the paragragh
  phrases.forEach((p) => {
    if (p.current === true) lastWord = p;
    // iterates through the words in the API returned string
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
    // Reserved for periods, dealing with them
    if (p.word === "." && speechLoc === p.key - 1) {
      p.alreadySpoken = true;
      p.highlight = true
      p.time = time;
      speechLoc+=1;
    }
    count++;
  });
  // returns the new paragraph object array
  res(phrases);
  
};

// function called on recieve that fades the words spoken out
// Does this after 2 seconds
const removeHighlight = () => {
  const fadeTime: number = 2000;
  phrases.forEach((p) => {
    if (p.highlight && p.time < Date.now() - fadeTime) {
      return (p.highlight = false);
    } else return;
  });
};
