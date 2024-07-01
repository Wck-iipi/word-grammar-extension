import * as React from "react";
import HeaderModelType from "./HeaderModelType";
import GrammarCorrectionAccordion from "./GrammarCorrectionAccordion";
import { UrlContext, LLMType } from "../context/urlContext";

const Welcome = () => {
  const value = {
    url: "Enter the key here",
    type: LLMType.Gemini,
  };

  return (
    <UrlContext.Provider value={value}>
      <HeaderModelType />
      <GrammarCorrectionAccordion />
    </UrlContext.Provider>
  );
};

export default Welcome;
