import { createContext, useContext } from "react";

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

export function useUrlContext() {
  const context = useContext(UrlContext);

  if (context === null) {
    throw new Error("URL is not working, please provide it again or check your connection if online");
  }

  return context;
}
