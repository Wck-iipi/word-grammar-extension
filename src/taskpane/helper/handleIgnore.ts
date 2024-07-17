import * as React from "react";
import { AccordionObject } from "@src/interface";

export function handleIgnore(
  parsedJSON: AccordionObject[],
  index: number,
  setParsedJSON: React.Dispatch<React.SetStateAction<AccordionObject[]>>
) {
  const filteredJSON = parsedJSON.filter((_, i) => i !== index);
  setParsedJSON(filteredJSON);
}
