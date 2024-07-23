import * as React from "react";
import { useContext } from "react";
import { makeStyles } from "@fluentui/react-components";
import { NeutralColors, SharedColors } from "@fluentui/theme";
import { UrlContext } from "@taskpane/context/urlContext";
import { LLMType } from "@src/enum";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  currentlyUsing: {
    backgroundColor: NeutralColors.gray30,
    display: "flex",
    flexFlow: "row",
    alignContent: "space-between",
    justifyContent: "space-between",
  },
  highlight: {
    color: SharedColors.green20,
  },
  left: {},
  right: {
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "underline",
  },
});

const HeaderModelType: React.FC = () => {
  const styles = useStyles();
  const currentLLMType: LLMType = useContext(UrlContext).type;
  const [returnToWelcome, setReturnToWelcome] = React.useState<boolean>(false);
  const history = useHistory();

  if (returnToWelcome) {
    history.push("/");
    return <h1>You shouldnt be seeing this.</h1>;
  } else {
    if (currentLLMType) {
      return (
        <div className={styles.currentlyUsing}>
          <p className={styles.left}>
            Currently using: <text className={styles.highlight}>{currentLLMType.toString()}</text>
          </p>
          <p
            className={styles.right}
            onClick={() => {
              localStorage.clear();
              setReturnToWelcome(true);
            }}
          >
            Change your key.
          </p>
        </div>
      );
    } else {
      return <p>Waiting from server</p>;
    }
  }
};

export default HeaderModelType;
