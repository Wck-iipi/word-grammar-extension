import { useState, useEffect, useContext } from "react";
import useGetText from "./useGetText";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { UrlContext } from "@taskpane/context/urlContext";
import { prePrompt } from "@taskpane/prompt/prompt";

const useFetchGemini = () => {
  const [text, loading, error] = useGetText();

  const [data, setData] = useState<string | null>(null);
  const [loadingLLM, setLoadingLLM] = useState(true);
  const [errorLLM, setErrorLLM] = useState<Error | null>(null);

  const apiKey = useContext(UrlContext).url;
  const genAI = new GoogleGenerativeAI(apiKey);

  useEffect(() => {
    if (!loading && !error) {
      const fetchData = async () => {
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
          const prompt = `${prePrompt}\n${text}`;
          const result = await model.generateContent(prompt);

          const response = result.response;

          const data = response.text();
          setData(data);
          setLoadingLLM(false);
        } catch (error) {
          setLoadingLLM(false);
          setErrorLLM(error);
        }
      };
      fetchData();
    }
  }, [loading, error, text]);

  return { loading, error, data, loadingLLM, errorLLM };
};

export default useFetchGemini;
