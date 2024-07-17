import * as React from "react";
import HeaderModelType from "./HeaderModelType";
import GrammarCorrectionMain from "./GrammarCorrectionMain";
import { UrlContext } from "@taskpane/context/urlContext";
import { LLMType } from "@src/enum";

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
