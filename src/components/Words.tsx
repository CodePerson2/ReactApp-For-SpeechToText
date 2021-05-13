import React from "react";

type wordProp = {
  word: string;
  highlight: boolean;
  current: boolean;
  alreadySpoken: boolean;
};

const Words = ({ word, highlight, current, alreadySpoken }: wordProp) => {
  return (
    <div
      className="word"
      style={{
        backgroundColor: highlight ? "yellow" : "transparent",
        borderBottom: current ? "4px solid red" : "none",
        color: highlight || !alreadySpoken ? "black" : "rgba(0, 0, 0, 0.39)",
        marginLeft: (word !== '.'? '10px': '0'),
      }}
    >
      {word}
    </div>
  );
};

export default Words;
