import * as React from "react";
import Welcome from "./Welcome";
import { useEffect } from "react";
import HeaderModelType from "./HeaderModelType";
import GrammarCorrectionMain from "./GrammarCorrectionMain";
import { UrlContext } from "@taskpane/context/urlContext";
import { LLMType } from "@src/enum";

interface AppProps {
  title: string;
}
const App: React.FC<AppProps> = (title: AppProps) => {
  // localStorage.clear();
  title;
  const [isKeySet, setHasKey] = React.useState<boolean>(false);

  useEffect(() => {
    const storedKey = localStorage.getItem("apiKey");
    if (storedKey) {
      setHasKey(true);
    }
  }, []);

  const handleKeySubmit = () => {
    setHasKey(true);
  };

  if (!isKeySet) {
    return <Welcome onKeySubmit={handleKeySubmit} />;
  } else {
    const value = {
      url: localStorage.getItem("apiKey"),
      type: localStorage.getItem("type") as LLMType,
    };
    return (
      <UrlContext.Provider value={value}>
        <HeaderModelType />
        <GrammarCorrectionMain />
      </UrlContext.Provider>
    );
  }
};

export default App;
