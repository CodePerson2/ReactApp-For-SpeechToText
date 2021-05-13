import React, { ReactNode } from "react";
import Words from "./Words";

type phrasesProp = {
  phrase: object[];
};

const Phrases = ({ phrase }: phrasesProp) => {
  return <div className="phrases">
    {
      phrase.map((p: any) => (
        <Words key={p.key} word={p.word} highlight={p.highlight} current={p.current} alreadySpoken={p.alreadySpoken}/>
      ))
  }
  </div>;
};

export default Phrases;
