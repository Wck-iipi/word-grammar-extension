import * as React from "react";
import { Accordion, AccordionItem, AccordionHeader, AccordionPanel, makeStyles } from "@fluentui/react-components";
import { NeutralColors, SharedColors } from "@fluentui/theme";
import { AddCircle12Filled } from "@fluentui/react-icons";
import GrammarCorrectionAccordionContent from "./GrammarCorrectionAccordionContent";

const useStyles = makeStyles({
  grammarText: {
    border: `1px solid ${NeutralColors.gray50}`,
    borderRadius: "5px",
    margin: "10px",
  },
});

const n = 5;
const GrammarCorrectionItemArray: Array<typeof Accordion> = new Array(n).fill(null);
const GrammarCorrectionHeaderMistakeArray: Array<string> = new Array(n).fill("Wrong");
const GrammarCorrectionHeaderMistakeWhatToDoArray: Array<string> = new Array(n).fill("Correct Spelling");
const GrammarCorrectionContentArray: Array<string> = new Array(n).fill("...this is a wrng sentence...");

const GrammarCorrectionAccordion: React.FC = () => {
  const styles = useStyles();
  return (
    <Accordion collapsible>
      {GrammarCorrectionItemArray.map((_, index) => {
        const errorColor = SharedColors.red20;
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
  );
};

export default GrammarCorrectionAccordion;
