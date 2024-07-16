import * as React from "react";
import { Link, makeStyles } from "@fluentui/react-components";
import { NeutralColors } from "@fluentui/theme";
import { typeOfCorrection, typeOfCorrectionDictionary } from "../prompt/promptCorrectionTypes";
import { Line } from "rc-progress";

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
  props;
  const style = useStyles();
  const typeOfCorrectionArray: typeOfCorrection[] = Object.values(typeOfCorrection) as typeOfCorrection[];

  return (
    <div>
      <footer className={style.footer}>
        {typeOfCorrectionArray.map((key, index) => {
          return (
            <div key={index} className={style.footerChild}>
              <Line
                percent={20}
                strokeWidth={5}
                trailWidth={5}
                strokeColor={props.typeOfCorrectionDictionaryState[key as typeOfCorrection].color}
              />
              <Link appearance="subtle" onClick={() => props.setCurrentTypeOfCorrection(key as typeOfCorrection)}>
                {typeOfCorrectionArray[index]}
              </Link>
            </div>
          );
        })}
      </footer>
    </div>
  );
};

export default GrammarCorrectionFooter;
