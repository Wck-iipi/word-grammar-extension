import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Welcome from "./Welcome";
import React from "react";
import { UrlContextType } from "@src/interface";

interface AppMainProps {
  setValue: React.Dispatch<React.SetStateAction<UrlContextType>>;
}

const AppMain: React.FC<AppMainProps> = ({ setValue }) => {
  const [isKeySet, setHasKey] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    const storedKey = localStorage.getItem("apiKey");
    if (storedKey) {
      setHasKey(true);
    }
  }, []);

  const handleKeySubmit = () => {
    setHasKey(true);
  };

  if (isKeySet) {
    history.push("/correction");
    return <h1> Hello world </h1>;
  } else {
    return <Welcome onKeySubmit={handleKeySubmit} setValue={setValue} />;
  }
};

export default AppMain;
