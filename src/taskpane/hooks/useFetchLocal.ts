// import { UrlContext } from "@taskpane/context/urlContext";
// import { useContext, useEffect, useState } from "react";
// import { prePrompt } from "@taskpane/prompt/prompt";
// import useGetText from "./useGetText";
//
// // TODO
// const useFetchLocal = () => {
//   const location = useContext(UrlContext).url;
//   const [data, setData] = useState<string | null>(null);
//   const [loadingLLM, setLoadingLLM] = useState(true);
//   const [errorLLM, setErrorLLM] = useState<Error | null>(null);
//
//   useEffect(() => {
//     if (!loading) {
//       const fetchData = async () => {
//         try {
//           const { text, error } = await useGetText();
//           const prompt = `${prePrompt}\n${text}`;
//           const serverLocation = location;
//           prompt;
//           serverLocation;
//
//           const response = await fetch("http://127.0.0.1:5000/", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ prompt: "This is test." }),
//             credentials: "include",
//           });
//           const data = await response.json();
//
//           setData(data);
//           setLoadingLLM(false);
//         } catch (error) {
//           setLoadingLLM(false);
//           setErrorLLM(error);
//         }
//       };
//       fetchData();
//     }
//   }, [loading, error, text]);
//
//   return { loading, error, data, loadingLLM, errorLLM };
// };
//
// export default useFetchLocal;
