import { useContext } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { UrlContext } from "@taskpane/context/urlContext";
import { prePrompt } from "@taskpane/prompt/prompt";
import getText from "@taskpane/helper/getText";

// const useFetchGemini = (
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>,
//   setError: React.Dispatch<React.SetStateAction<string | null>>,
//   setLoadingLLM: React.Dispatch<React.SetStateAction<boolean>>,
//   setErrorLLM: React.Dispatch<React.SetStateAction<string | null>>,
//   setData: React.Dispatch<React.SetStateAction<string | null>>
// ) => {
//   useEffect(() => {
//     const apiKey = useContext(UrlContext).url;
//     const genAI = new GoogleGenerativeAI(apiKey);
//     const fetchData = async () => {
//       try {
//         const textResult = await useGetText();
//         const { text, error } = textResult;
//         setLoading(false);
//         if (!error) {
//           const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
//           const prompt = `${prePrompt}\n${text}`;
//           const result = await model.generateContentStream(prompt);
//           let response = "";
//
//           for await (const chunk of result.stream) {
//             const chunkText = chunk.text();
//             response += chunkText;
//             const objectArray = response.split("}");
//             if (objectArray.length > 2) {
//               objectArray.pop();
//               const responseTextWithJson = objectArray.join("}");
//               setData(responseTextWithJson);
//               setLoadingLLM(false);
//             }
//           }
//
//           const data = response;
//           setData(data);
//         } else {
//           setError(error);
//         }
//       } catch (error) {
//         setLoadingLLM(false);
//         setErrorLLM(error);
//       }
//     };
//     fetchData();
//   }, []);
// };

const useFetchGemini = async (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoadingLLM: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorLLM: React.Dispatch<React.SetStateAction<string | null>>,
  setData: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const apiKey = useContext(UrlContext).url;
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const textResult = await getText();
    const { text, error } = textResult;
    setLoading(false);
    if (!error) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const prompt = `${prePrompt}\n${text}`;
      const result = await model.generateContentStream(prompt);
      let response = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        response += chunkText;
        if (chunkText.includes("}")) {
          const objectArray = response.split("}");
          if (objectArray.length > 2) {
            objectArray.pop();
            const responseTextWithJson = objectArray.join("}") + "}";
            setData(responseTextWithJson);
            setLoadingLLM(false);
          }
        }
      }

      const data = response;
      setData(data);
    } else {
      setError(error);
    }
  } catch (error) {
    setLoadingLLM(false);
    setErrorLLM(error);
  }
};

export default useFetchGemini;
