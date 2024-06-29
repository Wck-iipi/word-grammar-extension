import * as React from "react";
import { Button, makeStyles } from "@fluentui/react-components";
import { SharedColors } from "@fluentui/theme";

interface GrammarCorrectionAccordionContentProps {
  content: string;
}
const useStyles = makeStyles({
  buttonWrapper: {
    margin: "5px",
  },
  buttonAccept: {
    backgroundColor: SharedColors.greenCyan10,
    color: "white",
  },
  buttonIgnore: {
    color: SharedColors.red20,
    marginLeft: "5px",
  },
});

const GrammarCorrectionAccordionContent: React.FC<GrammarCorrectionAccordionContentProps> = (
  props: GrammarCorrectionAccordionContentProps
) => {
  const styles = useStyles();
  styles.buttonWrapper;
  return (
    <div>
      <p>{props.content}</p>
      <div className={styles.buttonWrapper}>
        <Button className={styles.buttonAccept}>Accept</Button>
        <Button className={styles.buttonIgnore}>Ignore</Button>
      </div>
    </div>
  );
};

export default GrammarCorrectionAccordionContent;
