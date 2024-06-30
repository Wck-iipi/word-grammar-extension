import * as React from "react";
import HeaderModelType from "./HeaderModelType";
import GrammarCorrectionAccordion from "./GrammarCorrectionAccordion";
import { UrlContext, LLMType, UrlContextType } from "../context/urlContext";

const Welcome = () => {
  const [value] = React.useState<UrlContextType>({
    url: "Enter-your-URL-here-for-the-time-being",
    type: LLMType.Gemini,
  });

  return (
    <UrlContext.Provider value={value}>
      <HeaderModelType />
      <GrammarCorrectionAccordion />
    </UrlContext.Provider>
  );
};

export default Welcome;
