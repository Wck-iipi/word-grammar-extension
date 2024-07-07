import { SharedColors } from "@fluentui/theme";

// What should be written in the footer
export enum typeOfCorrectionIndex {
  Correctness = 0,
  Clarity = 1,
  Engagement = 2,
  Delivery = 3,
  StyleGuide = 4,
}

export enum typeOfCorrection {
  Correctness = "Correctness",
  Clarity = "Clarity",
  Engagement = "Engagement",
  Delivery = "Delivery",
  StyleGuide = "Style Guide",
}

// Color you would prefer on expand icon
export enum typeOfCorrectionColor {
  Correctness = SharedColors.red10,
  Clarity = SharedColors.blue10,
  Engagement = SharedColors.green10,
  Delivery = SharedColors.orange10,
  StyleGuide = SharedColors.magenta10,
}
