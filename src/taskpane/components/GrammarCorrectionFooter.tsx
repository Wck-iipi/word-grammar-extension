import * as React from "react";
import { makeStyles, Link } from "@fluentui/react-components";
import { SharedColors, NeutralColors } from "@fluentui/theme";
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
  const style = useStyles();
  const typeOfCorrectionArray: typeOfCorrection[] = Object.keys(typeOfCorrection) as unknown as typeOfCorrection[];
  const typeOfCorrectionArrayLength = typeOfCorrectionArray.length;
  const typeOfCorrectionTsxArray = new Array<JSX.Element>(typeOfCorrectionArrayLength).fill(null);

  return (
    <div>
      <footer className={style.footer}>
        {typeOfCorrectionTsxArray.map((_, index) => {
          return (
            <div key={index} className={style.footerChild}>
              <Line percent={20} strokeWidth={5} trailWidth={5} strokeColor={SharedColors.red10} />
              <Link
                appearance="subtle"
                onClick={() => props.setCurrentTypeOfCorrection(typeOfCorrectionArray[index] as typeOfCorrection)}
              >
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
