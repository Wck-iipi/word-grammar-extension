import * as React from "react";
import HeaderModelType from "./HeaderModelType";
import GrammarCorrectionContentType from "./GrammarCorrectionContentType";
import { UrlContext, LLMType } from "../context/urlContext";

const Welcome = () => {
  const value = {
    url: "Enter your key here",
    type: LLMType.Gemini,
  };

  return (
    <UrlContext.Provider value={value}>
      <HeaderModelType />
      <GrammarCorrectionContentType />
    </UrlContext.Provider>
  );
};

export default Welcome;
