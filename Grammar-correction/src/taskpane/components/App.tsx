import * as React from "react";
import HeaderModelType from "./HeaderModelType";
import GrammarCorrectionAccordion from "./GrammarCorrectionAccordion";

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = (props: AppProps) => {
  return (
    <div>
      <h1>{props.title}</h1>
      <HeaderModelType />
      <GrammarCorrectionAccordion />
    </div>
  );
};

export default App;
