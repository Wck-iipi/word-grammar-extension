import * as React from "react";
import { Accordion, AccordionItem, AccordionHeader, AccordionPanel, makeStyles } from "@fluentui/react-components";
import { NeutralColors } from "@fluentui/theme";
import { AddCircle12Filled } from "@fluentui/react-icons";
import GrammarCorrectionAccordionContent from "./GrammarCorrectionAccordionContent";
import GrammarCorrectionFooter from "./GrammarCorrectionFooter";
import { AccordionObject, useParseJSON } from "../hooks/useParseJSON";
import { typeOfCorrectionDictionary, typeOfCorrection } from "../prompt/promptCorrectionTypes";
import { diffWords } from "diff";
import { useEffect } from "react";

const useStyles = makeStyles({
  grammarText: {
    border: `1px solid ${NeutralColors.gray50}`,
    borderRadius: "5px",
    margin: "10px",
  },
});

export enum GrammarCorrectionContentType {
  Addition,
  Removal,
  None,
}

export interface GrammarCorrectionContent {
  type: GrammarCorrectionContentType;
  content: string;
}

const processDiff = (value: AccordionObject) => {
  const sentence: Array<GrammarCorrectionContent> = [];

  const diff = diffWords(value.originalText, value.correctedText);

  let added_words = [];
  let removed_words = [];

  diff.forEach((part) => {
    if (part.added) {
      added_words.push(part.value);
    } else if (part.removed) {
      removed_words.push(part.value);
    } else {
      if (part.value !== " ") {
        let added_part = "";
        let removed_part = "";
        if (added_words.length > 0 || removed_words.length > 0) {
          added_part = added_words.join(" ");
          removed_part = removed_words.join(" ");
          if (removed_words.length > 0) {
            sentence.push({ type: GrammarCorrectionContentType.Removal, content: removed_part });
          }
          if (added_words.length > 0) {
            sentence.push({ type: GrammarCorrectionContentType.Addition, content: added_part });
          }
        }

        sentence.push({ type: GrammarCorrectionContentType.None, content: part.value });
        added_words = [];
        removed_words = [];
      }
    }
  });

  if (added_words.length > 0 || removed_words.length > 0) {
    const added_part = added_words.join(" ");
    const removed_part = removed_words.join(" ");
    if (added_words.length > 0) {
      sentence.push({ type: GrammarCorrectionContentType.Removal, content: removed_part });
    }
    if (removed_words.length > 0) {
      sentence.push({ type: GrammarCorrectionContentType.Addition, content: added_part });
    }
  }

  return sentence;
};

const getListContentByTypeOfCorrection = (typeOfCorrectionDictionaryState: typeOfCorrectionDictionary) => {
  const indexMainDictionary = {};

  for (const [key, value] of Object.entries(typeOfCorrectionDictionaryState)) {
    indexMainDictionary[key] = value.indexMainContent;
  }

  const rearrangedClassifiedByTypeOfCorrection = Object.keys(indexMainDictionary).sort(
    (a, b) => indexMainDictionary[a] - indexMainDictionary[b]
  ) as unknown as typeOfCorrection[];

  return rearrangedClassifiedByTypeOfCorrection;
};

const populateGrammarCorrectionArray = (n: number, typeOfCorrectionDictionaryState: typeOfCorrectionDictionary) => {
  const GrammarCorrectionHeaderMistakeArray: Array<string> = new Array(n).fill(null);
  const GrammarCorrectionHeaderMistakeWhatToDoArray: Array<string> = new Array(n).fill(null);
  const GrammarCorrectionContentArray: Array<Array<GrammarCorrectionContent>> = new Array(n).fill(null);
  const GrammarCorrectionColorArray: Array<string> = new Array(n).fill(null);

  const listContentByTypeOfCorrection: typeOfCorrection[] = getListContentByTypeOfCorrection(
    typeOfCorrectionDictionaryState
  );

  for (let i = 0; i < listContentByTypeOfCorrection.length; i++) {
    const textJson = typeOfCorrectionDictionaryState[listContentByTypeOfCorrection[i]].content;

    let indexCorrection = 0;
    if (i != 0) {
      indexCorrection = i * typeOfCorrectionDictionaryState[listContentByTypeOfCorrection[i - 1]].total;
    }

    for (const [indexTextJson, value] of textJson.entries()) {
      const index = indexTextJson + indexCorrection;
      GrammarCorrectionHeaderMistakeArray[index] = value.word;
      GrammarCorrectionHeaderMistakeWhatToDoArray[index] = value.whatToDo;
      GrammarCorrectionColorArray[index] = typeOfCorrectionDictionaryState[listContentByTypeOfCorrection[i]].color;

      const sentence = processDiff(value);

      GrammarCorrectionContentArray[index] = sentence;
    }
  }

  return {
    GrammarCorrectionHeaderMistakeArray,
    GrammarCorrectionHeaderMistakeWhatToDoArray,
    GrammarCorrectionContentArray,
    GrammarCorrectionColorArray,
  };
};

function classifyAndRearrangeByTypeOfContext(
  parsedJSON: Array<AccordionObject>,
  currentTypeOfCorrection: typeOfCorrection,
  setTypeOfCorrectionDictionaryState: React.Dispatch<React.SetStateAction<typeOfCorrectionDictionary>>
) {
  // In following, I am creating deep copy of typeOfCorrectionDictionary which
  // will be used to update the state.
  // This works because whenever there is new JSON, we don't need previous result, but
  // a new typeOfCorrectionDictionary as we will get a new result from LLM anyways

  const typeOfCorrectionDictionaryCopy = JSON.parse(
    JSON.stringify(typeOfCorrectionDictionary)
  ) as typeOfCorrectionDictionary;

  for (let i = 0; i < parsedJSON.length; i++) {
    const type = parsedJSON[i].type as unknown as typeOfCorrection;
    typeOfCorrectionDictionaryCopy[type].content.push(parsedJSON[i]);
    typeOfCorrectionDictionaryCopy[type].total += 1;
  }

  // for rearranging by index;
  // In this for loop, to avoid a ton of logic and code, indexMainContent will be set to -1
  // if currentTypeOfCorrection with content exist. Else original array will be returned
  // This will then be later used to put currentTypeOfCorrection in first and
  // everything else same in the back. If empty, we will not touch anything
  for (const [key, value] of Object.entries(typeOfCorrectionDictionaryCopy)) {
    if (key === currentTypeOfCorrection) {
      if (value.content.length !== 0) {
        typeOfCorrectionDictionaryCopy[key].indexMainContent = -1;
      }
    }
  }

  setTypeOfCorrectionDictionaryState(typeOfCorrectionDictionaryCopy);
}

const GrammarCorrectionMain: React.FC = () => {
  const styles = useStyles();
  const { loading, error, parsedJSON, loadingLLM, errorLLM, setParsedJSON } = useParseJSON();

  const [currentTypeOfCorrection, setCurrentTypeOfCorrection] = React.useState<typeOfCorrection>(
    typeOfCorrection.Correctness
  );

  const [typeOfCorrectionDictionaryState, setTypeOfCorrectionDictionaryState] =
    React.useState<typeOfCorrectionDictionary>(typeOfCorrectionDictionary);

  useEffect(() => {
    if (parsedJSON) {
      classifyAndRearrangeByTypeOfContext(parsedJSON, currentTypeOfCorrection, setTypeOfCorrectionDictionaryState);
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
    } = populateGrammarCorrectionArray(n, typeOfCorrectionDictionaryState);

    return (
      <div>
        <Accordion collapsible>
          {GrammarCorrectionItemArrayCurrent.map((_, index) => {
            return (
              <AccordionItem key={index} value={index} className={styles.grammarText}>
                <AccordionHeader expandIcon={<AddCircle12Filled primaryFill={GrammarCorrectionColorArray[index]} />}>
                  <b>{GrammarCorrectionHeaderMistakeArray.at(index)}</b>&ensp;<b>&#183;</b>&ensp;
                  {GrammarCorrectionHeaderMistakeWhatToDoArray.at(index)}
                </AccordionHeader>
                <AccordionPanel>
                  <GrammarCorrectionAccordionContent
                    content={GrammarCorrectionContentArray[index]}
                    index={index}
                    setParsedJSON={setParsedJSON}
                    parsedJSON={parsedJSON}
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
