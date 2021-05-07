import React, { ReactNode } from "react";
import Words from "./Words";

type phrasesProp = {
  phrase: object[];
};

const Phrases = ({ phrase }: phrasesProp) => {
  const words = (phrase: object[]): ReactNode => {
      console.log(phrase);
    return phrase.map((p: any) => (
      <Words key={p.key} word={p.word} highlight={p.highlight} />
    ));
  };
  return <div className="phrases">{words(phrase)}</div>;
};

export default Phrases;
