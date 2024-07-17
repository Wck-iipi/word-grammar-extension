import { useEffect, useState } from "react";
import useFetchGemini from "@taskpane/hooks/useFetchGemini";
import { AccordionObject } from "@src/interface";

export function useParseJSON() {
  const { loading, error, data, loadingLLM, errorLLM } = useFetchGemini();
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
