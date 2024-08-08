import * as React from "react";
import { Link, makeStyles } from "@fluentui/react-components";
import { NeutralColors, SharedColors } from "@fluentui/theme";
import { typeOfCorrection, typeOfCorrectionDictionary } from "../prompt/promptCorrectionTypes";
import { Line } from "rc-progress";
import { PresenceAvailable10Regular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  footer: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    height: "10%",
    backgroundColor: NeutralColors.gray20,
    display: "flex",
    alignItems: "center",
  },
  footerChild: {
    flexBasis: "100%",
    textAlign: "center",
    padding: "5px",
  },
});

interface GrammarCorrectionFooterProps {
  typeOfCorrectionDictionaryState: typeOfCorrectionDictionary;
  setTypeOfCorrectionDictionaryState: React.Dispatch<React.SetStateAction<typeOfCorrectionDictionary>>;
  currentTypeOfCorrection: typeOfCorrection;
  setCurrentTypeOfCorrection: React.Dispatch<React.SetStateAction<typeOfCorrection>>;
}

const GrammarCorrectionFooter: React.FC<GrammarCorrectionFooterProps> = (props: GrammarCorrectionFooterProps) => {
  const style = useStyles();
  const typeOfCorrectionArray: typeOfCorrection[] = Object.values(typeOfCorrection) as typeOfCorrection[];
  const percentArray: number[] = typeOfCorrectionArray.map((type) => {
    const { correct, total } = props.typeOfCorrectionDictionaryState[type];
    return total !== 0 ? (correct / total) * 100 : 100;
  });

  return (
    <div style={{ paddingBottom: "80px" }}>
      <footer className={style.footer}>
        {typeOfCorrectionArray.map((key, index) => {
          if (key === props.currentTypeOfCorrection) {
            return (
              <div
                key={index}
                style={{ backgroundColor: NeutralColors.gray50, margin: 0, height: "100%", width: "100%" }}
              >
                <div className={style.footerChild}>
                  <Line
                    percent={percentArray[index]}
                    strokeWidth={5}
                    trailWidth={5}
                    strokeColor={props.typeOfCorrectionDictionaryState[key as typeOfCorrection].color}
                  />
                  <Link appearance="subtle" onClick={() => props.setCurrentTypeOfCorrection(key as typeOfCorrection)}>
                    {typeOfCorrectionArray[index]}
                  </Link>
                </div>
              </div>
            );
          } else {
            if (percentArray[index] === 100) {
              return (
                <div key={index} className={style.footerChild}>
                  <PresenceAvailable10Regular color={SharedColors.green10} />
                  <br></br>
                  {typeOfCorrectionArray[index]}
                </div>
              );
            }
            return (
              <div key={index} className={style.footerChild}>
                <Line
                  percent={percentArray[index]}
                  strokeWidth={5}
                  trailWidth={5}
                  strokeColor={props.typeOfCorrectionDictionaryState[key as typeOfCorrection].color}
                />
                <Link appearance="subtle" onClick={() => props.setCurrentTypeOfCorrection(key as typeOfCorrection)}>
                  {typeOfCorrectionArray[index]}
                </Link>
              </div>
            );
          }
        })}
      </footer>
    </div>
  );
};

export default GrammarCorrectionFooter;
