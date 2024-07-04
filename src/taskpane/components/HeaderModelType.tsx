import * as React from "react";
import { useContext } from "react";
import { makeStyles } from "@fluentui/react-components";
import { NeutralColors, SharedColors } from "@fluentui/theme";
import { LLMType, UrlContext } from "../context/urlContext";

const useStyles = makeStyles({
  currentlyUsing: {
    backgroundColor: NeutralColors.gray30,
  },
  highlight: {
    color: SharedColors.green20,
  },
});

const HeaderModelType: React.FC = () => {
  const styles = useStyles();
  const currentLLMType: LLMType = useContext(UrlContext).type;

  return (
    <p className={styles.currentlyUsing}>
      Currently using: <text className={styles.highlight}>{currentLLMType.toString()}</text>
    </p>
  );
};

export default HeaderModelType;
