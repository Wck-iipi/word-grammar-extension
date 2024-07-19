import * as React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  makeStyles,
  Button,
} from "@fluentui/react-components";
import { NeutralColors } from "@fluentui/theme";
import { AddCircle12Filled } from "@fluentui/react-icons";
import GrammarCorrectionAccordionContent from "./GrammarCorrectionAccordionContent";
import GrammarCorrectionFooter from "./GrammarCorrectionFooter";
import { useParseJSON } from "../hooks/useParseJSON";
import { typeOfCorrectionDictionary, typeOfCorrection } from "../prompt/promptCorrectionTypes";
import { useEffect } from "react";
import {
  changeCurrentTypeToTypeWithContent,
  classifyAndRearrangeByTypeOfContext,
  getParsedJSONIndexArray,
  hightlightCurrentRange,
  populateGrammarCorrectionArray,
} from "@taskpane/helper/grammarCorrectionMainHelper";
import { handleAcceptAll } from "@taskpane/helper/handleAccept";

const useStyles = makeStyles({
  grammarText: {
    border: `1px solid ${NeutralColors.gray50}`,
    borderRadius: "5px",
    margin: "10px",
  },
});

const GrammarCorrectionMain: React.FC = () => {
  const styles = useStyles();
  const { loading, error, parsedJSON, loadingLLM, errorLLM, setParsedJSON } = useParseJSON();
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
        <Accordion collapsible>
          {GrammarCorrectionItemArrayCurrent.map((_, index) => {
            return (
              <AccordionItem
                key={index}
                value={index}
                className={styles.grammarText}
                onClick={() => hightlightCurrentRange(parsedJSON[parsedJSONIndexArray[index]].originalText)}
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
