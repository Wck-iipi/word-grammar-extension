import * as React from "react";
import Welcome from "./Welcome";

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = (props: AppProps) => {
  return (
    <div>
      <h1>{props.title}</h1>
      <Welcome />
    </div>
  );
};

export default App;
