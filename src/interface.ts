import { GrammarCorrectionContentType, LLMType } from "./enum";

// All interfaces that are NOT PROPS and NOT RELATED TO PROMPT will be defined here
export interface GrammarCorrectionContent {
  type: GrammarCorrectionContentType;
  content: string;
}

export interface UrlContextType {
  type: LLMType;
  url: string;
}

export interface AccordionObject {
  word: string;
  type: string;
  whatToDo: string;
  originalText: string;
  correctedText: string;
}
