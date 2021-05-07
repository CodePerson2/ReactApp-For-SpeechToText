import { useState } from "react/";
declare var io: any;
var socket = io.connect("/");

type data = {
  file: string;
};

type phrase = {
  word: string;
  highlight: boolean;
  key: number;
}[];

export var phrases: phrase = [
  { word: "hello", highlight: false, key: 1 },
  { word: "this", highlight: false, key: 2 },
  { word: "is", highlight: false, key: 3 },
  { word: "Bobby", highlight: false, key: 4 },
];

export const recieve = () => {
  return new Promise((res, rej) => {
    socket.on("audioText", (data: data) => {
      parseWords(data.file, res);
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

  phrases.forEach((p) => {
    apiArr.forEach((a) => {
      if (p.word === a) {
        p.key = Math.floor(Math.random() * 10000);
        return (p.highlight = true);
      } else return (p.highlight = false);
    });
  });
  res(phrases);
};
