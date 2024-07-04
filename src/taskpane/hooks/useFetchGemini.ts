import { useState, useEffect, useContext } from "react";
import useGetText from "./useGetText";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { UrlContext } from "../context/urlContext";

const prePrompt = `
This is Wrogn text. This one, however, is correct. It is a combination of factors that cause the present situation. This is a completely correct sentence. Our main role is to raise money by way of donations in order to fund the works of these charities.
You will be given sentences like above. You are a grammar and spelling correction expert with more than 10 years of experience.
What you will be doing is to find out the sentences which can be written in a better way.  You will be doing the following:
1. First you will find which word(s) has error. Write this after "word:".
2. Then you will find out what type of correction it is. There are 5 types to choose from:
a. Correctness
b. Clarity
c. Engagement
d. Delivery
e. Style Guide
You will find out what the appropriate type is and then write it after "type:"
3. You will find out what to do in each error. Keep this short(preferably between 1-7 words). Write this after "whatToDo:".
4. You will then write the incorrect sentence where this is happening. Write this after "originalText:".
5. You will then write the corrected sentence. Write this after "correctedText:"

For example the output of above sentences will be:
1. {"word": "Wrogn", "type": "Correctness", "whatToDo": "Spelling Error", "originalText": "This is Wrogn text.", "correctedText": "This is wrong text."}
2. {"word": "cause", "type": "Correctness", "whatToDo": "Change to causes", "originalText": "It is a combination of factors that cause the present situation", "correctedText": "It is a combination of factors that causes the present situation"}
3. {"word": "by way of donations in order to fund the works of", "type": "Clarity", "whatToDo": "Change to to fund", "originalText": "Our main role is to raise money by way of donations in order to fund the works of these charities.", "correctedText": "Our main role is to raise money to fund these charities."}
Based on the above commands, you will be given text below. Keep in mind the text will be connected and you have to look for EVERY MISTAKE. Pay close attention to proper nouns and ensure they are capitalized correctly.. Correct the text below and ONLY WRITE THE OUTPUT:
`;

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
