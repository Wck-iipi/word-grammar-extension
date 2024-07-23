import { useContext, useEffect, useState } from "react";
import useFetchGemini from "@taskpane/hooks/useFetchGemini";
import { AccordionObject } from "@src/interface";
import { LLMType } from "@src/enum";
import useFetchLocal from "./useFetchLocal";
import { UrlContext } from "@taskpane/context/urlContext";

export function useParseJSON() {
  const currentLLMType = useContext(UrlContext).type;
  const { loading, error, data, loadingLLM, errorLLM } =
    currentLLMType === LLMType.Gemini ? useFetchGemini() : useFetchLocal();
  const [parsedJSON, setParsedJSON] = useState<Array<AccordionObject>>(null);

  useEffect(() => {
    if (data) {
      const text = data.toString();
      const jsonData: Array<string> = text.match(/\{(.*?)\}/gs);
      setParsedJSON(jsonData.map((data) => JSON.parse(data)));
    }
  }, [data]);

  return { loading, error, parsedJSON, loadingLLM, errorLLM, setParsedJSON };
}
