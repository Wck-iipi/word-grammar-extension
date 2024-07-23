import { createContext } from "react";
import { LLMType } from "@src/enum";
import { UrlContextType } from "@src/interface";

export const UrlContext = createContext<UrlContextType>({
  type: LLMType.Gemini,
  url: "Enter Key here",
});
