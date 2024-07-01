import useFetchGemini from "../hooks/useFetchGemini";

export function getCorrectText() {
  const [loading, error, data, loadingLLM, errorLLM] = useFetchGemini();

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

  return data.toString();
}
