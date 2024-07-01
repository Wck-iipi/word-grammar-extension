import useFetchGemini from "../hooks/useFetchGemini";

export interface AccordionObject {
  word: string;
  type: string;
  whatToDo: string;
  originalText: string;
  correctedText: string;
}

export function getCorrectTextJSON() {
  const { loading, error, data, loadingLLM, errorLLM } = useFetchGemini();

  if (loading) {
    return "Fetching Text from Word...";
  }
  if (error) {
    return `Error fetching text(word related error): ${error}`;
  }
  if (loadingLLM) {
    return "Fetching data from LLM...";
  }
  if (errorLLM) {
    return `Error fetching data from LLM: ${errorLLM}`;
  }

  const text = data.toString();
  const jsonData: Array<string> = text.match(/\{(.*?)\}/gs);
  const parsedJsonData: Array<AccordionObject> = jsonData.map((data) => JSON.parse(data));

  return parsedJsonData;
}
