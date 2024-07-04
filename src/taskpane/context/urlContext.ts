import { createContext } from "react";

export enum LLMType {
  Gemini = "Gemini",
  Local = "Local",
}

export interface UrlContextType {
  type: LLMType;
  url: string;
}

export const UrlContext = createContext<UrlContextType>({
  type: LLMType.Local,
  url: "None",
});
