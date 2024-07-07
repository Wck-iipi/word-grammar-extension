import * as React from "react";
import GrammarCorrectionAccordion from "./GrammarCorrectionAccordion";
import { makeStyles, Link, ProgressBar } from "@fluentui/react-components";
import { SharedColors, NeutralColors } from "@fluentui/theme";
import { typeOfCorrection } from "../prompt/promptCorrectionTypes";

const useStyles = makeStyles({
  footer: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    height: "10%",
    backgroundColor: NeutralColors.gray20,
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  progressBar: {
    color: SharedColors.red10,
  },
});

const GrammarCorrectionContentType = () => {
  const style = useStyles();
  const [currentTypeOfCorrection, setCurrentTypeOfCorrection] = React.useState<typeOfCorrection>(
    typeOfCorrection.Clarity
  );

  const typeOfCorrectionArray: typeOfCorrection[] = Object.keys(typeOfCorrection) as typeOfCorrection[];
  const typeOfCorrectionArrayLength = typeOfCorrectionArray.length;
  // typeOfCorrectionTsxArray and typeOfCorrectionArray will have bijection so that
  // enum can be generalized
  const typeOfCorrectionTsxArray = new Array<JSX.Element>(typeOfCorrectionArrayLength).fill(null);

  //TODO: Add the correct color to the progress bar(couldn't find easy option so will do it later)

  return (
    <div>
      <GrammarCorrectionAccordion currentTypeOfCorrection={currentTypeOfCorrection} />
      <footer className={style.footer}>
        {typeOfCorrectionTsxArray.map((_, index) => {
          return (
            <div key={index}>
              <ProgressBar value={0.5} thickness="large" />
              <Link
                appearance="subtle"
                onClick={() => setCurrentTypeOfCorrection(typeOfCorrectionArray[index] as typeOfCorrection)}
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

export default GrammarCorrectionContentType;
