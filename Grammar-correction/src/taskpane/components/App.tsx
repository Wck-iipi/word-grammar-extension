import * as React from "react";
import HeaderModelType from "./HeaderModelType";
import GrammarContentCard from "./GrammarContentCard";

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = (props: AppProps) => {
  return (
    <div>
      <h1>{props.title}</h1>
      <HeaderModelType />
      <GrammarContentCard />
    </div>
  );
};

export default App;
