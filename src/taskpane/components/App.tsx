import * as React from "react";
import HeaderModelType from "./HeaderModelType";
import GrammarCorrectionMain from "./GrammarCorrectionMain";
import { UrlContext } from "@taskpane/context/urlContext";
import { Switch, Route, HashRouter } from "react-router-dom";
import AppMain from "./AppMain";
import { UrlContextType } from "@src/interface";
import { LLMType } from "@src/enum";

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = (title: AppProps) => {
  title;
  // const url = localStorage.getItem("apiKey");
  // const type = localStorage.getItem("type") as LLMType;
  const [value, setValue] = React.useState<UrlContextType>({
    url: localStorage.getItem("apiKey"),
    type: (localStorage.getItem("type") as LLMType) || LLMType.Gemini,
  });
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <AppMain setValue={setValue} />
        </Route>
        <Route exact path="/correction">
          <UrlContext.Provider value={value}>
            <HeaderModelType />
            <GrammarCorrectionMain />
          </UrlContext.Provider>
        </Route>
      </Switch>
    </HashRouter>
  );
};

export default App;
