import * as React from "react";
import { makeStyles } from "@fluentui/react-components";
import { NeutralColors, SharedColors } from "@fluentui/theme";

enum LanguageModel {
  online = "online",
  offline = "offline",
}

const useStyles = makeStyles({
  currentlyUsing: {
    backgroundColor: NeutralColors.gray30,
  },
  highlight: {
    color: SharedColors.green20,
  },
});

let currentLLM: LanguageModel = LanguageModel.online;

const HeaderModelType: React.FC = () => {
  const styles = useStyles();
  return (
    <p className={styles.currentlyUsing}>
      Currently using: <text className={styles.highlight}>{currentLLM}</text>
    </p>
  );
};

export default HeaderModelType;
