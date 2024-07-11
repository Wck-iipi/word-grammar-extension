import { SharedColors } from "@fluentui/theme";
import { AccordionObject } from "../hooks/useParseJSON";

export enum typeOfCorrection {
  Correctness = "Correctness",
  Clarity = "Clarity",
  Engagement = "Engagement",
  Delivery = "Delivery",
  StyleGuide = "Style Guide",
}

// export enum typeOfCorrection {
//   Correctness,
//   Clarity,
//   Engagement,
//   Delivery,
//   StyleGuide,
// }

export interface typeOfCorrectionDictionaryEntry {
  title: string;
  indexMainContent: number;
  indexFooter: number;
  color: string;
  content: AccordionObject[];
  correct: number;
  total: number;
}

export type typeOfCorrectionDictionary = {
  [key in typeOfCorrection]: typeOfCorrectionDictionaryEntry;
};

// indexFooter doesn't change but indexMainContent does
// based on clicked type of correction
export const typeOfCorrectionDictionary: typeOfCorrectionDictionary = {
  [typeOfCorrection.Correctness]: {
    title: "Correctness",
    indexMainContent: 0,
    indexFooter: 0,
    color: SharedColors.red10,
    content: [],
    correct: 0,
    total: 0,
  },
  [typeOfCorrection.Clarity]: {
    title: "Clarity",
    indexMainContent: 1,
    indexFooter: 1,
    color: SharedColors.blue10,
    content: [],
    correct: 0,
    total: 0,
  },
  [typeOfCorrection.Engagement]: {
    title: "Engagement",
    indexMainContent: 2,
    indexFooter: 2,
    color: SharedColors.green10,
    content: [],
    correct: 0,
    total: 0,
  },
  [typeOfCorrection.Delivery]: {
    title: "Delivery",
    indexMainContent: 3,
    indexFooter: 3,
    color: SharedColors.orange10,
    content: [],
    correct: 0,
    total: 0,
  },
  [typeOfCorrection.StyleGuide]: {
    title: "Style Guide",
    indexMainContent: 4,
    indexFooter: 4,
    color: SharedColors.magenta10,
    content: [],
    correct: 0,
    total: 0,
  },
};
