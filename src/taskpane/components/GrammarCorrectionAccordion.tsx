import * as React from "react";
import { Accordion, AccordionItem, AccordionHeader, AccordionPanel, makeStyles } from "@fluentui/react-components";
import { NeutralColors, SharedColors } from "@fluentui/theme";
import { AddCircle12Filled } from "@fluentui/react-icons";
import GrammarCorrectionAccordionContent from "./GrammarCorrectionAccordionContent";
import { AccordionObject, useParseJSON } from "../hooks/useParseJSON";
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

const populateGrammarCorrectionArray = (n: number, textJson: AccordionObject[]) => {
  const GrammarCorrectionHeaderMistakeArray: Array<string> = new Array(n).fill("");
  const GrammarCorrectionHeaderMistakeWhatToDoArray: Array<string> = new Array(n).fill("");
  const GrammarCorrectionContentArray: Array<Array<GrammarCorrectionContent>> = new Array(n).fill("");

  for (const [index, value] of textJson.entries()) {
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
  }

  return {
    GrammarCorrectionHeaderMistakeArray,
    GrammarCorrectionHeaderMistakeWhatToDoArray,
    GrammarCorrectionContentArray,
  };
};

const GrammarCorrectionAccordion: React.FC = () => {
  const styles = useStyles();
  const { loading, error, parsedJSON, loadingLLM, errorLLM, setParsedJSON } = useParseJSON();
  const errorColor = SharedColors.red20;

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
    const GrammarCorrectionItemArray: Array<typeof Accordion> = new Array(n).fill(null);

    const {
      GrammarCorrectionHeaderMistakeArray,
      GrammarCorrectionHeaderMistakeWhatToDoArray,
      GrammarCorrectionContentArray,
    } = populateGrammarCorrectionArray(n, parsedJSON);

    return (
      <div>
        <Accordion collapsible>
          {GrammarCorrectionItemArray.map((_, index) => {
            return (
              <AccordionItem key={index} value={index} className={styles.grammarText}>
                <AccordionHeader expandIcon={<AddCircle12Filled primaryFill={errorColor} />}>
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
