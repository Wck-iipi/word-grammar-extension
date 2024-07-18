import * as React from "react";
import { Button, makeStyles } from "@fluentui/react-components";
import { SharedColors } from "@fluentui/theme";
import { handleIgnore } from "@taskpane/helper/handleIgnore";
import { handleAccept } from "@taskpane/helper/handleAccept";
import { AccordionObject, GrammarCorrectionContent } from "@src/interface";
import { GrammarCorrectionContentType } from "@src/enum";
import { typeOfCorrection, typeOfCorrectionDictionary } from "@taskpane/prompt/promptCorrectionTypes";

interface GrammarCorrectionAccordionContentProps {
  content: Array<GrammarCorrectionContent>;
  setParsedJSON: React.Dispatch<React.SetStateAction<AccordionObject[]>>;
  index: number;
  parsedJSON: AccordionObject[];
  setTypeOfCorrectionDictionaryState: React.Dispatch<React.SetStateAction<typeOfCorrectionDictionary>>;
  typeOfCorrectionClicked: typeOfCorrection;
}
const useStyles = makeStyles({
  buttonWrapper: {
    margin: "5px",
  },
  buttonAccept: {
    backgroundColor: SharedColors.greenCyan10,
    color: "white",
    border: "0px",
    ":hover": {
      backgroundColor: SharedColors.green20,
      color: "white",
    },
  },
  buttonIgnore: {
    color: SharedColors.red20,
    marginLeft: "5px",
    border: "0px",
    ":hover": {
      color: SharedColors.red10,
    },
  },
});

const GrammarCorrectionAccordionContent: React.FC<GrammarCorrectionAccordionContentProps> = (
  props: GrammarCorrectionAccordionContentProps
) => {
  const styles = useStyles();
  styles.buttonWrapper;

  const GrammarCorrectionContentArray = props.content;

  return (
    <div>
      {GrammarCorrectionContentArray.map((content, index) => {
        return (
          <span key={index} style={{ display: "inline" }}>
            {content.type === GrammarCorrectionContentType.Addition ? (
              <span style={{ color: SharedColors.green20, display: "inline" }}>
                {content.content}
                {""}{" "}
              </span>
            ) : content.type === GrammarCorrectionContentType.Removal ? (
              <span style={{ color: SharedColors.red20, textDecoration: "line-through", display: "inline" }}>
                {content.content}{" "}
              </span>
            ) : (
              <span style={{ display: "inline" }}>{content.content}</span>
            )}
          </span>
        );
      })}
      <div className={styles.buttonWrapper}>
        <Button
          className={styles.buttonAccept}
          onClick={() => {
            handleAccept(
              props.parsedJSON,
              props.index,
              props.setParsedJSON,
              props.setTypeOfCorrectionDictionaryState,
              props.typeOfCorrectionClicked
            );
          }}
        >
          Accept
        </Button>
        <Button
          className={styles.buttonIgnore}
          onClick={() => {
            handleIgnore(props.parsedJSON, props.index, props.setParsedJSON);
          }}
        >
          Ignore
        </Button>
      </div>
    </div>
  );
};

export default GrammarCorrectionAccordionContent;
