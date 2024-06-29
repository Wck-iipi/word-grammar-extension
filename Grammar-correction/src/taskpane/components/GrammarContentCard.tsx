import * as React from "react";
import { Accordion, AccordionItem, AccordionHeader, AccordionPanel, makeStyles } from "@fluentui/react-components";
import { NeutralColors, SharedColors } from "@fluentui/theme";
import { AddCircle12Filled } from "@fluentui/react-icons";

const useStyles = makeStyles({
  grammarText: {
    border: `1px solid ${NeutralColors.gray130}`,
    margin: "10px",
  },
});

const n = 5;
const GrammarCorrectionContent: Array<typeof Accordion> = new Array(n).fill(null);

const GrammarContentCard: React.FC = () => {
  const styles = useStyles();
  return (
    <Accordion collapsible>
      {GrammarCorrectionContent.map((_, index) => {
        const errorColor = SharedColors.red20;
        return (
          <AccordionItem key={index} value={index} className={styles.grammarText}>
            <AccordionHeader expandIcon={<AddCircle12Filled primaryFill={errorColor} />}>
              Sentence error
            </AccordionHeader>
            <AccordionPanel>
              <div className="Hello1">Helloing</div>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default GrammarContentCard;
