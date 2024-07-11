import * as React from "react";
import HeaderModelType from "./HeaderModelType";
import GrammarCorrectionMain from "./GrammarCorrectionMain";
import { UrlContext, LLMType } from "../context/urlContext";

const Welcome = () => {
  const value = {
    url: "Enter your API KEY HERE",
    type: LLMType.Gemini,
  };

  return (
    <UrlContext.Provider value={value}>
      <HeaderModelType />
      <GrammarCorrectionMain />
    </UrlContext.Provider>
  );
};

export default Welcome;
