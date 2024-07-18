import { typeOfCorrection, typeOfCorrectionDictionary } from "@taskpane/prompt/promptCorrectionTypes";
import { diffWords } from "diff";
import { GrammarCorrectionContentType } from "@src/enum";
import { AccordionObject, GrammarCorrectionContent } from "@src/interface";

const processDiff = (value: AccordionObject) => {
  const sentence: Array<GrammarCorrectionContent> = [];

  const diff = diffWords(value.originalText, value.correctedText);

  let added_words = [];
  let removed_words = [];

  diff.forEach((part) => {
    if (part.added) {
      added_words.push(part.value);
    } else if (part.removed) {
      removed_words.push(part.value);
    } else {
      if (part.value !== " ") {
        let added_part = "";
        let removed_part = "";
        if (added_words.length > 0 || removed_words.length > 0) {
          added_part = added_words.join(" ");
          removed_part = removed_words.join(" ");
          if (removed_words.length > 0) {
            sentence.push({ type: GrammarCorrectionContentType.Removal, content: removed_part });
          }
          if (added_words.length > 0) {
            sentence.push({ type: GrammarCorrectionContentType.Addition, content: added_part });
          }
        }

        sentence.push({ type: GrammarCorrectionContentType.None, content: part.value });
        added_words = [];
        removed_words = [];
      }
    }
  });

  if (added_words.length > 0 || removed_words.length > 0) {
    const added_part = added_words.join(" ");
    const removed_part = removed_words.join(" ");
    if (added_words.length > 0) {
      sentence.push({ type: GrammarCorrectionContentType.Removal, content: removed_part });
    }
    if (removed_words.length > 0) {
      sentence.push({ type: GrammarCorrectionContentType.Addition, content: added_part });
    }
  }

  return sentence;
};

const getListContentByTypeOfCorrection = (typeOfCorrectionDictionaryState: typeOfCorrectionDictionary) => {
  const indexMainDictionary = {};

  for (const [key, value] of Object.entries(typeOfCorrectionDictionaryState)) {
    indexMainDictionary[key] = value.indexMainContent;
  }

  const rearrangedClassifiedByTypeOfCorrection = Object.keys(indexMainDictionary).sort(
    (a, b) => indexMainDictionary[a] - indexMainDictionary[b]
  ) as unknown as typeOfCorrection[];

  return rearrangedClassifiedByTypeOfCorrection;
};

export function getParsedJSONIndexArray(
  parsedJSON: AccordionObject[],
  typeOfCorrectionDictionaryState: typeOfCorrectionDictionary
) {
  const getParsedJSONIndexArray: Array<number> = [];
  const listContentByTypeOfCorrection: typeOfCorrection[] = getListContentByTypeOfCorrection(
    typeOfCorrectionDictionaryState
  );

  for (let i = 0; i < listContentByTypeOfCorrection.length; i++) {
    const textJson = typeOfCorrectionDictionaryState[listContentByTypeOfCorrection[i]].content;

    for (const [_, value] of textJson.entries()) {
      getParsedJSONIndexArray.push(parsedJSON.indexOf(value));
    }
  }

  return getParsedJSONIndexArray;
}
export const populateGrammarCorrectionArray = (typeOfCorrectionDictionaryState: typeOfCorrectionDictionary) => {
  const GrammarCorrectionHeaderMistakeArray: Array<string> = [];
  const GrammarCorrectionHeaderMistakeWhatToDoArray: Array<string> = [];
  const GrammarCorrectionColorArray: Array<string> = [];
  const GrammarCorrectionContentArray: Array<Array<GrammarCorrectionContent>> = [];
  const typeOfCorrectionArray: Array<typeOfCorrection> = [];

  const listContentByTypeOfCorrection: typeOfCorrection[] = getListContentByTypeOfCorrection(
    typeOfCorrectionDictionaryState
  );

  for (let i = 0; i < listContentByTypeOfCorrection.length; i++) {
    const textJson = typeOfCorrectionDictionaryState[listContentByTypeOfCorrection[i]].content;

    for (const [_, value] of textJson.entries()) {
      GrammarCorrectionHeaderMistakeArray.push(value.word);
      GrammarCorrectionHeaderMistakeWhatToDoArray.push(value.whatToDo);
      GrammarCorrectionColorArray.push(typeOfCorrectionDictionaryState[listContentByTypeOfCorrection[i]].color);
      typeOfCorrectionArray.push(listContentByTypeOfCorrection[i]);
      const sentence = processDiff(value);

      GrammarCorrectionContentArray.push(sentence);
    }
  }

  return {
    GrammarCorrectionHeaderMistakeArray,
    GrammarCorrectionHeaderMistakeWhatToDoArray,
    GrammarCorrectionContentArray,
    GrammarCorrectionColorArray,
    typeOfCorrectionArray,
  };
};

function getClassifiedAndRearrangedByTypeOfCorrectionObject(
  parsedJSON: Array<AccordionObject>,
  currentTypeOfCorrection: typeOfCorrection
) {
  // In following, I am creating deep copy of typeOfCorrectionDictionary which
  // will be used to update the state.
  // This works because whenever there is new JSON, we don't need previous result, but
  // a new typeOfCorrectionDictionary as we will get a new result from LLM anyways

  const typeOfCorrectionDictionaryCopy = JSON.parse(
    JSON.stringify(typeOfCorrectionDictionary)
  ) as typeOfCorrectionDictionary;

  for (let i = 0; i < parsedJSON.length; i++) {
    const type = parsedJSON[i].type as unknown as typeOfCorrection;
    typeOfCorrectionDictionaryCopy[type].content.push(parsedJSON[i]);
    typeOfCorrectionDictionaryCopy[type].total += 1;
  }

  // for rearranging by index;
  // In this for loop, to avoid a ton of logic and code, indexMainContent will be set to -1
  // if currentTypeOfCorrection with content exist. Else original array will be returned
  // This will then be later used to put currentTypeOfCorrection in first and
  // everything else same in the back. If empty, we will not touch anything
  for (const [key, value] of Object.entries(typeOfCorrectionDictionaryCopy)) {
    if (key === currentTypeOfCorrection) {
      if (value.content.length !== 0) {
        typeOfCorrectionDictionaryCopy[key].indexMainContent = -1;
      }
    }
  }
  return typeOfCorrectionDictionaryCopy;
}

export function classifyAndRearrangeByTypeOfContext(
  parsedJSON: Array<AccordionObject>,
  currentTypeOfCorrection: typeOfCorrection,
  setTypeOfCorrectionDictionaryState: React.Dispatch<React.SetStateAction<typeOfCorrectionDictionary>>,
  isFirstRenderWithParsedJSON: boolean
) {
  const typeOfCorrectionDictionary = getClassifiedAndRearrangedByTypeOfCorrectionObject(
    parsedJSON,
    currentTypeOfCorrection
  );
  // setTypeOfCorrectionDictionaryState(typeOfCorrectionDictionary);
  if (isFirstRenderWithParsedJSON) {
    setTypeOfCorrectionDictionaryState(typeOfCorrectionDictionary);
  } else {
    setTypeOfCorrectionDictionaryState((prev) => {
      for (const [key] of Object.entries(typeOfCorrectionDictionary)) {
        typeOfCorrectionDictionary[key as typeOfCorrection].correct = prev[key as typeOfCorrection].correct;
        typeOfCorrectionDictionary[key as typeOfCorrection].total = prev[key as typeOfCorrection].total;
      }
      return typeOfCorrectionDictionary;
    });
  }
}

export function changeCurrentTypeToTypeWithContent(
  typeOfCorrectionDictionaryState: typeOfCorrectionDictionary,
  setCurrentTypeOfCorrection: React.Dispatch<React.SetStateAction<typeOfCorrection>>
) {
  setCurrentTypeOfCorrection((prev) => {
    if (typeOfCorrectionDictionaryState[prev].content.length === 0) {
      for (const [_, value] of Object.entries(typeOfCorrection)) {
        if (typeOfCorrectionDictionaryState[value].content.length !== 0) {
          return value;
        }
      }
    }
    return prev;
  });
}

export let __test__;
if (process.env.NODE_ENV === "test") {
  __test__ = {
    processDiff,
    getListContentByTypeOfCorrection,
    getClassifiedAndRearrangedByTypeOfCorrectionObject,
  };
}
