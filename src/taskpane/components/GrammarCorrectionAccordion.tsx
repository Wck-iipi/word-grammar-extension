import * as React from "react";
import { Accordion, AccordionItem, AccordionHeader, AccordionPanel, makeStyles } from "@fluentui/react-components";
import { NeutralColors } from "@fluentui/theme";
import { AddCircle12Filled } from "@fluentui/react-icons";
import GrammarCorrectionAccordionContent from "./GrammarCorrectionAccordionContent";
import { AccordionObject, useParseJSON } from "../hooks/useParseJSON";
import { typeOfCorrection, typeOfCorrectionColor, typeOfCorrectionIndex } from "../prompt/promptCorrectionTypes";
import { diffWords } from "diff";

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

const populateGrammarCorrectionArray = (
  n: number,
  rearrangedClassifiedByTypeOfCorrection: AccordionObject[][],
  colorRearrangedClassifiedByTypeOfCorrection: typeOfCorrectionColor[]
) => {
  const GrammarCorrectionHeaderMistakeArray: Array<string> = new Array(n).fill("");
  const GrammarCorrectionHeaderMistakeWhatToDoArray: Array<string> = new Array(n).fill("");
  const GrammarCorrectionContentArray: Array<Array<GrammarCorrectionContent>> = new Array(n).fill(null);
  const GrammarCorrectionColorArray: Array<typeOfCorrectionColor> = new Array(n).fill(null);

  for (let i = 0; i < rearrangedClassifiedByTypeOfCorrection.length; i++) {
    const textJson = rearrangedClassifiedByTypeOfCorrection[i];
    let indexCorrection = 0;
    if (i != 0) {
      indexCorrection = i * rearrangedClassifiedByTypeOfCorrection[i - 1].length;
    }

    for (const [indexTextJson, value] of textJson.entries()) {
      const index = indexTextJson + indexCorrection;
      GrammarCorrectionHeaderMistakeArray[index] = value.word;
      GrammarCorrectionHeaderMistakeWhatToDoArray[index] = value.whatToDo;

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

      GrammarCorrectionContentArray[index] = sentence;
      GrammarCorrectionColorArray[index] = colorRearrangedClassifiedByTypeOfCorrection[i];
    }
  }

  return {
    GrammarCorrectionHeaderMistakeArray,
    GrammarCorrectionHeaderMistakeWhatToDoArray,
    GrammarCorrectionContentArray,
    GrammarCorrectionColorArray,
  };
};

interface GrammarCorrectionAccordionProps {
  currentTypeOfCorrection: typeOfCorrection;
}

function rearrangeArrayByIndex(
  classifiedByTypeOfCorrection: Array<Array<AccordionObject>>,
  colorClassifiedByTypeOfCorrection: Array<typeOfCorrectionColor>,
  index: number,
  currentTypeOfCorrection: typeOfCorrection,
  validCorrectionTypes: Array<typeOfCorrection>
) {
  const rearrangedClassifiedByTypeOfCorrection: Array<Array<AccordionObject>> = [];
  const colorRearrangedClassifiedByTypeOfCorrection: Array<typeOfCorrectionColor> = [];

  if (validCorrectionTypes.includes(currentTypeOfCorrection)) {
    // Always add the specified index first
    rearrangedClassifiedByTypeOfCorrection.push(classifiedByTypeOfCorrection[index]);
    colorRearrangedClassifiedByTypeOfCorrection.push(colorClassifiedByTypeOfCorrection[index]);

    // Then add all other non-empty arrays
    for (let i = 0; i < classifiedByTypeOfCorrection.length; i++) {
      if (i !== index && classifiedByTypeOfCorrection[i].length > 0) {
        rearrangedClassifiedByTypeOfCorrection.push(classifiedByTypeOfCorrection[i]);
        colorRearrangedClassifiedByTypeOfCorrection.push(colorClassifiedByTypeOfCorrection[i]);
      }
    }
  } else {
    for (let i = 0; i < classifiedByTypeOfCorrection.length; i++) {
      if (classifiedByTypeOfCorrection[i].length > 0) {
        rearrangedClassifiedByTypeOfCorrection.push(classifiedByTypeOfCorrection[i]);
        colorRearrangedClassifiedByTypeOfCorrection.push(colorClassifiedByTypeOfCorrection[i]);
      }
    }
  }

  return { rearrangedClassifiedByTypeOfCorrection, colorRearrangedClassifiedByTypeOfCorrection };
}

function getKeyFromValue<T extends Record<string, string | number>>(value: T[keyof T], requiredEnum: T): keyof T {
  // Loop through the enum keys and compare values
  for (const key in requiredEnum) {
    if (requiredEnum[key] === value) {
      return key as keyof T;
    }
  }
  // Throw error if value not found
  throw new Error("Value not found in enum");
}

function classifyAndRearrangeByTypeOfContext(
  parsedJSON: Array<AccordionObject>,
  classifiedByTypeOfCorrection: Array<Array<AccordionObject>>,
  colorClassifiedByTypeOfCorrection: Array<typeOfCorrectionColor>,
  index: number,
  currentTypeOfCorrection: typeOfCorrection
) {
  for (let i = 0; i < parsedJSON.length; i++) {
    const type = parsedJSON[i].type;
    const key = getKeyFromValue(type as typeOfCorrection, typeOfCorrection) as typeOfCorrection;
    const index = typeOfCorrectionIndex[key] as number;
    classifiedByTypeOfCorrection[index].push(parsedJSON[i]);
  }

  for (const key in typeOfCorrectionIndex) {
    colorClassifiedByTypeOfCorrection[typeOfCorrectionIndex[key]] = typeOfCorrectionColor[key as typeOfCorrection];
  }

  const validCorrectionTypes: Array<typeOfCorrection> = [];

  for (let i = 0; i < classifiedByTypeOfCorrection.length; i++) {
    if (classifiedByTypeOfCorrection[i].length > 0) {
      validCorrectionTypes.push(getKeyFromValue(i as typeOfCorrectionIndex, typeOfCorrectionIndex) as typeOfCorrection);
    }
  }

  const { rearrangedClassifiedByTypeOfCorrection, colorRearrangedClassifiedByTypeOfCorrection } = rearrangeArrayByIndex(
    classifiedByTypeOfCorrection,
    colorClassifiedByTypeOfCorrection,
    index,
    currentTypeOfCorrection,
    validCorrectionTypes
  );
  return { rearrangedClassifiedByTypeOfCorrection, colorRearrangedClassifiedByTypeOfCorrection };
}

const GrammarCorrectionAccordion: React.FC<GrammarCorrectionAccordionProps> = (
  props: GrammarCorrectionAccordionProps
) => {
  props;
  const styles = useStyles();
  const { loading, error, parsedJSON, loadingLLM, errorLLM, setParsedJSON } = useParseJSON();

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
    const totalTypeOfCorrection = Object.keys(typeOfCorrection).length;

    const classifiedByTypeOfCorrection: Array<Array<AccordionObject>> = Array.from(
      { length: totalTypeOfCorrection },
      () => []
    );
    const index = typeOfCorrectionIndex[props.currentTypeOfCorrection];
    const colorClassifiedByTypeOfCorrection: Array<typeOfCorrectionColor> = new Array(totalTypeOfCorrection).fill(null);

    const { rearrangedClassifiedByTypeOfCorrection, colorRearrangedClassifiedByTypeOfCorrection } =
      classifyAndRearrangeByTypeOfContext(
        parsedJSON,
        classifiedByTypeOfCorrection,
        colorClassifiedByTypeOfCorrection,
        index,
        props.currentTypeOfCorrection
      );

    const n = parsedJSON.length;
    const GrammarCorrectionItemArrayCurrent: Array<typeof Accordion> = new Array(n).fill(null);

    const {
      GrammarCorrectionHeaderMistakeArray,
      GrammarCorrectionHeaderMistakeWhatToDoArray,
      GrammarCorrectionContentArray,
      GrammarCorrectionColorArray,
    } = populateGrammarCorrectionArray(
      n,
      rearrangedClassifiedByTypeOfCorrection,
      colorRearrangedClassifiedByTypeOfCorrection
    );

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
      </div>
    );
  }
  return "You shouldn't be seeing this";
};

export default GrammarCorrectionAccordion;
