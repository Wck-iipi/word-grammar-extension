import * as React from "react";
import { Accordion, AccordionItem, AccordionHeader, AccordionPanel, makeStyles } from "@fluentui/react-components";
import { NeutralColors, SharedColors } from "@fluentui/theme";
import { AddCircle12Filled } from "@fluentui/react-icons";
import GrammarCorrectionAccordionContent from "./GrammarCorrectionAccordionContent";
import { AccordionObject, getCorrectTextJSON } from "../helper/getCorrectTextJSON";
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

    let sentence: Array<GrammarCorrectionContent> = [];

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
            if (added_words.length > 0) {
              sentence.push({ type: GrammarCorrectionContentType.Removal, content: removed_part });
            }
            if (removed_words.length > 0) {
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
      let added_part = added_words.join(" ");
      let removed_part = removed_words.join(" ");
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
  const textJson = getCorrectTextJSON();
  const n = textJson.length;
  const GrammarCorrectionItemArray: Array<typeof Accordion> = new Array(n).fill(null);

  const errorColor = SharedColors.red20;

  if (typeof textJson === "string") {
    return <div>{textJson}</div>;
  } else {
    const {
      GrammarCorrectionHeaderMistakeArray,
      GrammarCorrectionHeaderMistakeWhatToDoArray,
      GrammarCorrectionContentArray,
    } = populateGrammarCorrectionArray(n, textJson);
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
                  <GrammarCorrectionAccordionContent content={GrammarCorrectionContentArray[index]} />
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  }
};

export default GrammarCorrectionAccordion;
