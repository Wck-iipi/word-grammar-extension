import { createContext } from "react";
import { LLMType } from "@src/enum";
import { UrlContextType } from "@src/interface";

export const UrlContext = createContext<UrlContextType>({
  type: LLMType.Local,
  url: "None",
});
