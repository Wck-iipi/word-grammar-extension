import * as React from "react";
import { Button, makeStyles } from "@fluentui/react-components";
import { SharedColors } from "@fluentui/theme";
import { GrammarCorrectionContent, GrammarCorrectionContentType } from "./GrammarCorrectionAccordion";
import { AccordionObject } from "../hooks/useParseJSON";
import { handleIgnore } from "../helper/handleIgnore";
import { handleAccept } from "../helper/handleAccept";

interface GrammarCorrectionAccordionContentProps {
  content: Array<GrammarCorrectionContent>;
  setParsedJSON: React.Dispatch<React.SetStateAction<AccordionObject[]>>;
  index: number;
  parsedJSON: AccordionObject[];
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
            handleAccept(props.parsedJSON, props.index, props.setParsedJSON);
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
