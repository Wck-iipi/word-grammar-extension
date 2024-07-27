import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  makeStyles,
  Button,
} from "@fluentui/react-components";
import { NeutralColors, SharedColors } from "@fluentui/theme";
import { AddCircle12Filled } from "@fluentui/react-icons";
import GrammarCorrectionAccordionContent from "./GrammarCorrectionAccordionContent";
import GrammarCorrectionFooter from "./GrammarCorrectionFooter";
// import { useParseJSON } from "../hooks/useParseJSON";
import { typeOfCorrectionDictionary, typeOfCorrection } from "../prompt/promptCorrectionTypes";
import { useContext, useEffect } from "react";
import {
  changeCurrentTypeToTypeWithContent,
  classifyAndRearrangeByTypeOfContext,
  getParsedJSONIndexArray,
  selectCurrentRange,
  populateGrammarCorrectionArray,
} from "@taskpane/helper/grammarCorrectionMainHelper";
import { handleAcceptAll } from "@taskpane/helper/handleAccept";
import { AccordionObject } from "@src/interface";
import getText from "@taskpane/helper/getText";
import { UrlContext } from "@taskpane/context/urlContext";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prePrompt } from "@taskpane/prompt/prompt";

const useStyles = makeStyles({
  grammarText: {
    border: `1px solid ${NeutralColors.gray50}`,
    borderRadius: "5px",
    margin: "10px",
  },
});

const GrammarCorrectionMain: React.FC = () => {
  const styles = useStyles();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [parsedJSON, setParsedJSON] = React.useState<Array<AccordionObject> | null>(null);
  const [loadingLLM, setLoadingLLM] = React.useState<boolean>(true);
  const [errorLLM, setErrorLLM] = React.useState<string | null>(null);

  // const { loading, error, parsedJSON, loadingLLM, errorLLM, setParsedJSON } = useParseJSON();

  const apiKey = useContext(UrlContext).url;
  const genAI = new GoogleGenerativeAI(apiKey);

  useEffect(() => {
    const parseJSON = async () => {
      const { text, error } = await getText();
      setLoading(false);
      let totalLog = "";
      try {
        if (!error) {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
          const prompt = `${prePrompt}\n${text}`;
          const result = await model.generateContentStream(prompt);

          // Rethink logic again(with copy future varun)
          let jsonObjectString = "";

          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            // response += chunkText;
            totalLog += `chunkText: ${chunkText}\n`;
            totalLog += `jsonObjectString: ${jsonObjectString}\n`;

            if (chunkText.includes("\ude3d")) {
              const completeJSONString = jsonObjectString + chunkText;
              const objectArray = completeJSONString.split("𩸽");

              if (chunkText.at(-1) === "\ude3d") {
                jsonObjectString = "";
              } else {
                jsonObjectString = objectArray.pop();
              }

              totalLog += `objectArray: ${objectArray}\n`;
              totalLog += `objectArrayLength: ${objectArray.length}\n}`;
              // totalLog += `mapOutput: ${objectArray.map((data) => data + ",")}\n`;
              // jsonString = jsonString.replace(/\t/g, '\\t');
              const parsedJSONArray = objectArray.map((data) =>
                JSON.parse(data.replace(/\t/g, "\\t").replace(/\n/g, "\\n"))
              );
              // const parsedJSONArray = helloKittyArray.map((data) => JSON.parse(data));
              totalLog += `parsedJSONArray: ${parsedJSONArray}\n`;

              setParsedJSON((prevState) => {
                if (!prevState) {
                  return parsedJSONArray as AccordionObject[];
                } else {
                  const newState = [...prevState, ...parsedJSONArray];
                  // Force re-render by creating a new array reference
                  return newState.length === prevState.length ? [...newState] : newState;
                }
              });
              setLoadingLLM(false);
            } else {
              jsonObjectString += chunkText;
            }
          }
        } else {
          setError(error);
        }
      } catch (error) {
        setLoadingLLM(false);
        setErrorLLM(totalLog + error);
      }
      // parseJSON(setLoading, setError, setParsedJSON, setLoadingLLM, setErrorLLM);
    };
    parseJSON();
  }, []);

  const [currentTypeOfCorrection, setCurrentTypeOfCorrection] = React.useState<typeOfCorrection>(
    typeOfCorrection.Correctness
  );
  const [isFirstRenderWithParsedJSON, setIsFirstRenderWithParsedJSON] = React.useState<boolean>(true);

  const [typeOfCorrectionDictionaryState, setTypeOfCorrectionDictionaryState] =
    React.useState<typeOfCorrectionDictionary>(typeOfCorrectionDictionary);

  // TODO: Fix double clicking on handleAllAccept or handleAccept
  // to update (Not urgent cuz I like it)
  useEffect(() => {
    if (parsedJSON) {
      classifyAndRearrangeByTypeOfContext(
        parsedJSON,
        currentTypeOfCorrection,
        setTypeOfCorrectionDictionaryState,
        isFirstRenderWithParsedJSON
      );
      changeCurrentTypeToTypeWithContent(typeOfCorrectionDictionaryState, setCurrentTypeOfCorrection);
      setIsFirstRenderWithParsedJSON(false);
    }
  }, [parsedJSON, currentTypeOfCorrection]);

  if (error) {
    return `Error fetching text(word related error): ${error}`;
  }
  if (errorLLM) {
    return `Error fetching data from LLM: ${errorLLM}`;
  }
  if (loading) {
    return "Fetching Text from Word...";
  }
  if (loadingLLM) {
    return "Fetching data from LLM...";
  }
  if (parsedJSON) {
    const n = parsedJSON.length;
    const GrammarCorrectionItemArrayCurrent: Array<typeof Accordion> = new Array(n).fill(null);

    const {
      GrammarCorrectionHeaderMistakeArray,
      GrammarCorrectionHeaderMistakeWhatToDoArray,
      GrammarCorrectionContentArray,
      GrammarCorrectionColorArray,
      typeOfCorrectionArray,
    } = populateGrammarCorrectionArray(typeOfCorrectionDictionaryState);

    const parsedJSONIndexArray = getParsedJSONIndexArray(parsedJSON, typeOfCorrectionDictionaryState);
    const currentTypeEndsIndex = typeOfCorrectionDictionaryState[currentTypeOfCorrection].content.length;
    const currentTypeParsedJSONIndexArray = parsedJSONIndexArray.slice(0, currentTypeEndsIndex);

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            style={{ backgroundColor: typeOfCorrectionDictionaryState[currentTypeOfCorrection].color, color: "White" }}
            onClick={() =>
              handleAcceptAll(
                parsedJSON,
                currentTypeParsedJSONIndexArray,
                setParsedJSON,
                typeOfCorrectionDictionaryState,
                setTypeOfCorrectionDictionaryState,
                currentTypeOfCorrection
              )
            }
          >
            Accept all {currentTypeOfCorrection}
          </Button>
          <Button
            style={{ backgroundColor: SharedColors.pinkRed10, color: "White" }}
            onClick={() => window.location.reload()}
          >
            Reload
          </Button>
        </div>
        <Accordion collapsible>
          {GrammarCorrectionItemArrayCurrent.map((_, index) => {
            return (
              <AccordionItem
                key={index}
                value={index}
                className={styles.grammarText}
                onClick={() => selectCurrentRange(parsedJSON[parsedJSONIndexArray[index]].originalText)}
              >
                <AccordionHeader expandIcon={<AddCircle12Filled primaryFill={GrammarCorrectionColorArray[index]} />}>
                  <b>{GrammarCorrectionHeaderMistakeArray.at(index)}</b>&ensp;<b>&#183;</b>&ensp;
                  {GrammarCorrectionHeaderMistakeWhatToDoArray.at(index)}
                </AccordionHeader>
                <AccordionPanel>
                  <GrammarCorrectionAccordionContent
                    content={GrammarCorrectionContentArray[index]}
                    index={parsedJSONIndexArray[index]}
                    setParsedJSON={setParsedJSON}
                    parsedJSON={parsedJSON}
                    setTypeOfCorrectionDictionaryState={setTypeOfCorrectionDictionaryState}
                    typeOfCorrectionClicked={typeOfCorrectionArray[index]}
                  />
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
        <GrammarCorrectionFooter
          typeOfCorrectionDictionaryState={typeOfCorrectionDictionaryState}
          setTypeOfCorrectionDictionaryState={setTypeOfCorrectionDictionaryState}
          currentTypeOfCorrection={currentTypeOfCorrection}
          setCurrentTypeOfCorrection={setCurrentTypeOfCorrection}
        />
      </div>
    );
  }
  return "You shouldn't be seeing this";
};

export default GrammarCorrectionMain;
