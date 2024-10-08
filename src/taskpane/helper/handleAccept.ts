import * as React from "react";
import { parse } from "node-html-parser";
import { diffWords } from "diff";
import { handleIgnore } from "./handleIgnore";
import { AccordionObject } from "@src/interface";
import { typeOfCorrection, typeOfCorrectionDictionary } from "@taskpane/prompt/promptCorrectionTypes";

function replaceWithStyleMaintained(innerHTML: string, originalText: string, correctedText: string) {
  const diff = diffWords(originalText, correctedText);

  let added_words = [];
  let removed_words = [];
  // Below variable is to check whether the previous part was opposite(removed or added) of current
  let hasOpposite = false;

  let prevPart = "";

  diff.forEach((part) => {
    if (part.added) {
      if (removed_words.length > 0) {
        hasOpposite = true;
      }
      added_words.push(part.value);
    } else if (part.removed) {
      if (added_words.length > 0) {
        hasOpposite = true;
      }
      removed_words.push(part.value);
    } else {
      if (part.value !== " ") {
        if (added_words.length > 0 || removed_words.length > 0) {
          if (hasOpposite) {
            innerHTML = innerHTML.replace(removed_words.join(" ").trim(), added_words.join(" ").trim());
          } else {
            if (removed_words.length > 0) {
              for (const word of removed_words) {
                innerHTML = innerHTML.replace(word, "");
              }
            } else {
              if (prevPart.length > 0) {
                const prevWord = prevPart.trim().split(" ")[prevPart.trim().split(" ").length - 1];
                innerHTML = innerHTML.replace(prevWord + " ", prevWord + " " + added_words);
              } else {
                innerHTML = added_words + innerHTML;
              }
            }
          }
          added_words = [];
          removed_words = [];
        }
      }
    }
    if (!part.added && !part.removed) {
      prevPart = part.value;
    }
  });

  return innerHTML;
}

async function replaceText(originalText: string, newText: string) {
  newText;
  try {
    await Word.run(async (context) => {
      const result = context.document.body.search(originalText, {
        ignorePunct: false,
        matchCase: true,
        matchWholeWord: true,
      });

      context.load(result, "text, font");
      await context.sync();
      const htmlResult = result.items[0].getHtml();
      await context.sync();

      // Get body tag out of this and then within the body tag, find the wrong word

      const parsedHTML = parse(htmlResult.value);
      const errorHTMLMain = parsedHTML.getElementsByTagName("span");

      if (errorHTMLMain.length > 1) {
        throw new Error("Multiple paragraphs found. This shouldn't be happening");
      }

      const body = replaceWithStyleMaintained(errorHTMLMain[0].innerHTML, originalText, newText);

      if (result.items.length > 1) {
        // TODO support multiple instances or not because low-probability of this happening
        throw new Error("Multiple instances of wrong sentences found. Currently, not supported.");
      } else {
        result.items[0].insertHtml(body.toString(), "Replace");
      }
    });
  } catch (error) {
    console.error("Error replacing text:", error);
  }
}

// TODO: Make replaceMultipleText to make handleAcceptAll more efficient.
// In this, ensure context.sync() is called once instead of n times.

export function handleAccept(
  parsedJSON: AccordionObject[],
  index: number,
  setParsedJSON: React.Dispatch<React.SetStateAction<AccordionObject[]>>,
  setTypeOfCorrectionDictionaryState: React.Dispatch<React.SetStateAction<typeOfCorrectionDictionary>>,
  typeOfCorrectionClicked: typeOfCorrection
) {
  replaceText(parsedJSON[index].originalText, parsedJSON[index].correctedText);
  setTypeOfCorrectionDictionaryState((prev) => ({
    ...prev,
    [typeOfCorrectionClicked]: {
      ...prev[typeOfCorrectionClicked],
      correct: prev[typeOfCorrectionClicked].correct + 1,
    },
  }));
  handleIgnore(parsedJSON, index, setParsedJSON);
}

export async function handleAcceptAll(
  parsedJSON: AccordionObject[],
  currentTypeParsedJSONIndexArray: number[],
  setParsedJSON: React.Dispatch<React.SetStateAction<AccordionObject[]>>,
  typeOfCorrectionDictionaryState: typeOfCorrectionDictionary,
  setTypeOfCorrectionDictionaryState: React.Dispatch<React.SetStateAction<typeOfCorrectionDictionary>>,
  typeOfCorrectionClicked: typeOfCorrection
) {
  const typeOfCorrectionDictionaryCopy: typeOfCorrectionDictionary = JSON.parse(
    JSON.stringify(typeOfCorrectionDictionaryState)
  );
  let parsedJSONCopy = [...parsedJSON];
  for (const index of currentTypeParsedJSONIndexArray) {
    replaceText(parsedJSON[index].originalText, parsedJSON[index].correctedText);
    typeOfCorrectionDictionaryCopy[typeOfCorrectionClicked].correct += 1;
  }
  parsedJSONCopy = parsedJSONCopy.filter((_, index) => !currentTypeParsedJSONIndexArray.includes(index));
  setTypeOfCorrectionDictionaryState(typeOfCorrectionDictionaryCopy);
  setParsedJSON(parsedJSONCopy);
}
export let __test__;

if (process.env.NODE_ENV === "test") {
  __test__ = { replaceWithStyleMaintained, replaceText };
}
