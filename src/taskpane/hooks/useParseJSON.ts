import React from "react";
import { useState } from "react";
import useFetchGemini from "@taskpane/hooks/useFetchGemini";
import { AccordionObject } from "@src/interface";

export function parseJSON(
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setParsedJSON: React.Dispatch<React.SetStateAction<Array<AccordionObject>>>,
  setLoadingLLM: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorLLM: React.Dispatch<React.SetStateAction<string | null>>
) {
  const [data, setData] = useState<string | null>(null);

  useFetchGemini(setLoading, setError, setLoadingLLM, setErrorLLM, setData);

  // const currentLLMType = useContext(UrlContext).type;
  // Change useFetchLocal later
  // if (currentLLMType === LLMType.Gemini) {
  //   useFetchGemini(setLoading, setError, setLoadingLLM, setErrorLLM, setData);
  // } else if (currentLLMType === LLMType.Local) {
  //   useFetchLocal();
  // }

  if (data) {
    const text = data.toString();
    const jsonData: Array<string> = text.match(/\{(.*?)\}/gs);
    // throw new Error("" + text + "\n\n" + jsonData);
    setParsedJSON(jsonData.map((data) => JSON.parse(data)));
  }
}
