import { SharedColors } from "@fluentui/theme";
import { GrammarCorrectionContentType } from "@src/enum";
import { AccordionObject } from "@src/interface";
import { __test__, populateGrammarCorrectionArray } from "@taskpane/helper/grammarCorrectionMainHelper";

import {
  typeOfCorrection,
  typeOfCorrectionDictionary,
  typeOfCorrectionDictionaryEntry,
} from "@taskpane/prompt/promptCorrectionTypes";
const { processDiff, getClassifiedAndRearrangedByTypeOfCorrectionObject } = __test__;

describe("processDiff", () => {
  test("handles empty strings", () => {
    const value: AccordionObject = {
      originalText: "",
      correctedText: "",
      whatToDo: "",
      word: "",
      type: "Correctness",
    };
    expect(processDiff(value)).toEqual([{ content: "", type: GrammarCorrectionContentType.None }]);
  });

  test("handles no changes", () => {
    const value: AccordionObject = {
      originalText: "No changes",
      correctedText: "No changes",
      whatToDo: "",
      word: "",
      type: "Correctness",
    };
    expect(processDiff(value)).toEqual([{ type: GrammarCorrectionContentType.None, content: "No changes" }]);
  });

  test("handles only additions", () => {
    const value: AccordionObject = {
      originalText: "Text",
      correctedText: "New Text",
      whatToDo: "",
      word: "",
      type: "Correctness",
    };
    expect(processDiff(value)).toEqual([
      { type: GrammarCorrectionContentType.Addition, content: "New " },
      { type: GrammarCorrectionContentType.None, content: "Text" },
    ]);
  });

  test("handles only removals", () => {
    const value: AccordionObject = {
      originalText: "Old Text",
      correctedText: "Text",
      whatToDo: "",
      word: "",
      type: "Correctness",
    };
    expect(processDiff(value)).toEqual([
      { type: GrammarCorrectionContentType.Removal, content: "Old " },
      { type: GrammarCorrectionContentType.None, content: "Text" },
    ]);
  });

  test("handles multiple changes", () => {
    const value: AccordionObject = {
      originalText: "Old text with errors",
      correctedText: "New text without mistakes",
      whatToDo: "",
      word: "",
      type: "Correctness",
    };
    expect(processDiff(value)).toEqual([
      { type: GrammarCorrectionContentType.Removal, content: "Old" },
      { type: GrammarCorrectionContentType.Addition, content: "New" },
      { type: GrammarCorrectionContentType.None, content: " text " },
      { type: GrammarCorrectionContentType.Removal, content: "with errors" },
      { type: GrammarCorrectionContentType.Addition, content: "without mistakes" },
    ]);
  });

  test("handles changes at the end", () => {
    const value: AccordionObject = {
      originalText: "Text with old ending",
      correctedText: "Text with new finish",
      whatToDo: "",
      word: "",
      type: "Correctness",
    };
    expect(processDiff(value)).toEqual([
      { type: GrammarCorrectionContentType.None, content: "Text with " },
      { type: GrammarCorrectionContentType.Removal, content: "old ending" },
      { type: GrammarCorrectionContentType.Addition, content: "new finish" },
    ]);
  });
});

describe("populateGrammarCorrectionArray", () => {
  const mockTypeOfCorrectionDictionary: typeOfCorrectionDictionary = {
    [typeOfCorrection.Correctness]: {
      title: "Correctness",
      indexMainContent: 0,
      indexFooter: 0,
      color: SharedColors.red10,
      content: [
        {
          type: typeOfCorrection.Correctness,
          word: "Grammar1",
          whatToDo: "Fix1",
          originalText: "Old1",
          correctedText: "New1",
        },
        {
          type: typeOfCorrection.Correctness,
          word: "Grammar2",
          whatToDo: "Fix2",
          originalText: "Old2",
          correctedText: "New2",
        },
      ],
      correct: 0,
      total: 2,
    },
    [typeOfCorrection.Clarity]: {
      title: "Clarity",
      indexMainContent: 1,
      indexFooter: 1,
      color: SharedColors.blue10,
      content: [
        {
          type: typeOfCorrection.Clarity,
          word: "Clarity1",
          whatToDo: "Improve1",
          originalText: "Unclear1",
          correctedText: "Clear1",
        },
      ],
      correct: 0,
      total: 1,
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

  const mockTypeOfCorrectionDictionaryWithNegativeIndexOnContentWithElement: typeOfCorrectionDictionary = {
    [typeOfCorrection.Correctness]: {
      title: "Correctness",
      indexMainContent: 0,
      indexFooter: 0,
      color: SharedColors.red10,
      content: [
        {
          type: typeOfCorrection.Correctness,
          word: "Grammar1",
          whatToDo: "Fix1",
          originalText: "Old1",
          correctedText: "New1",
        },
        {
          type: typeOfCorrection.Correctness,
          word: "Grammar2",
          whatToDo: "Fix2",
          originalText: "Old2",
          correctedText: "New2",
        },
      ],
      correct: 0,
      total: 2,
    },
    [typeOfCorrection.Clarity]: {
      title: "Clarity",
      indexMainContent: -1,
      indexFooter: 1,
      color: SharedColors.blue10,
      content: [
        {
          type: typeOfCorrection.Clarity,
          word: "Clarity1",
          whatToDo: "Improve1",
          originalText: "Unclear1",
          correctedText: "Clear1",
        },
        {
          type: typeOfCorrection.Clarity,
          word: "Clarity2",
          whatToDo: "Improve2",
          originalText: "Unclear2",
          correctedText: "Clear2",
        },
      ],
      correct: 0,
      total: 2,
    },
    [typeOfCorrection.Engagement]: {
      title: "Engagement",
      indexMainContent: 2,
      indexFooter: 2,
      color: SharedColors.green10,
      content: [
        {
          type: typeOfCorrection.Engagement,
          word: "Engagement1",
          whatToDo: "ImproveEngagement1",
          originalText: "UnclearEngagement1",
          correctedText: "ClearEngagement1",
        },
        {
          type: typeOfCorrection.Engagement,
          word: "Engagement2",
          whatToDo: "ImproveEngagement2",
          originalText: "UnclearEngagement2",
          correctedText: "ClearEngagement2",
        },
      ],
      correct: 0,
      total: 2,
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

  const mockTypeOfCorrectionDictionaryWithNegativeIndexOnContentWithNoElement: typeOfCorrectionDictionary = {
    [typeOfCorrection.Correctness]: {
      title: "Correctness",
      indexMainContent: 0,
      indexFooter: 0,
      color: SharedColors.red10,
      content: [
        {
          type: typeOfCorrection.Correctness,
          word: "Grammar1",
          whatToDo: "Fix1",
          originalText: "Old1",
          correctedText: "New1",
        },
        {
          type: typeOfCorrection.Correctness,
          word: "Grammar2",
          whatToDo: "Fix2",
          originalText: "Old2",
          correctedText: "New2",
        },
      ],
      correct: 0,
      total: 2,
    },
    [typeOfCorrection.Clarity]: {
      title: "Clarity",
      indexMainContent: 1,
      indexFooter: 1,
      color: SharedColors.blue10,
      content: [
        {
          type: typeOfCorrection.Clarity,
          word: "Clarity1",
          whatToDo: "Improve1",
          originalText: "Unclear1",
          correctedText: "Clear1",
        },
        {
          type: typeOfCorrection.Clarity,
          word: "Clarity2",
          whatToDo: "Improve2",
          originalText: "Unclear2",
          correctedText: "Clear2",
        },
      ],
      correct: 0,
      total: 2,
    },
    [typeOfCorrection.Engagement]: {
      title: "Engagement",
      indexMainContent: 2,
      indexFooter: 2,
      color: SharedColors.green10,
      content: [
        {
          type: typeOfCorrection.Engagement,
          word: "Engagement1",
          whatToDo: "ImproveEngagement1",
          originalText: "UnclearEngagement1",
          correctedText: "ClearEngagement1",
        },
        {
          type: typeOfCorrection.Engagement,
          word: "Engagement2",
          whatToDo: "ImproveEngagement2",
          originalText: "UnclearEngagement2",
          correctedText: "ClearEngagement2",
        },
      ],
      correct: 0,
      total: 2,
    },
    [typeOfCorrection.Delivery]: {
      title: "Delivery",
      indexMainContent: -1,
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
  test("handles empty dictionary", () => {
    const result = populateGrammarCorrectionArray({} as typeOfCorrectionDictionary);
    expect(result.GrammarCorrectionHeaderMistakeArray).toEqual([]);
    expect(result.GrammarCorrectionHeaderMistakeWhatToDoArray).toEqual([]);
    expect(result.GrammarCorrectionContentArray).toEqual([]);
    expect(result.GrammarCorrectionColorArray).toEqual([]);
  });

  describe("populates arrays correctly", () => {
    test("No negative index", () => {
      const result = populateGrammarCorrectionArray(mockTypeOfCorrectionDictionary);

      expect(result.GrammarCorrectionHeaderMistakeArray).toEqual(["Grammar1", "Grammar2", "Clarity1"]);
      expect(result.GrammarCorrectionHeaderMistakeWhatToDoArray).toEqual(["Fix1", "Fix2", "Improve1"]);
      expect(result.GrammarCorrectionColorArray).toEqual([SharedColors.red10, SharedColors.red10, SharedColors.blue10]);

      expect(result.GrammarCorrectionContentArray.length).toBe(3);
      result.GrammarCorrectionContentArray.forEach((content) => {
        expect(Array.isArray(content)).toBe(true);
        content.forEach((item) => {
          expect(item).toHaveProperty("type");
          expect(item).toHaveProperty("content");
        });
      });
    });

    test("With negative index on content with element", () => {
      const result = populateGrammarCorrectionArray(
        mockTypeOfCorrectionDictionaryWithNegativeIndexOnContentWithElement
      );
      expect(result.GrammarCorrectionHeaderMistakeArray).toEqual([
        "Clarity1",
        "Clarity2",
        "Grammar1",
        "Grammar2",
        "Engagement1",
        "Engagement2",
      ]);
      expect(result.GrammarCorrectionHeaderMistakeWhatToDoArray).toEqual([
        "Improve1",
        "Improve2",
        "Fix1",
        "Fix2",
        "ImproveEngagement1",
        "ImproveEngagement2",
      ]);
      expect(result.GrammarCorrectionColorArray).toEqual([
        SharedColors.blue10,
        SharedColors.blue10,
        SharedColors.red10,
        SharedColors.red10,
        SharedColors.green10,
        SharedColors.green10,
      ]);

      expect(result.GrammarCorrectionContentArray.length).toBe(6);
    });

    test("With negative index on content without element", () => {
      const result = populateGrammarCorrectionArray(
        mockTypeOfCorrectionDictionaryWithNegativeIndexOnContentWithNoElement
      );
      expect(result.GrammarCorrectionHeaderMistakeArray).toEqual([
        "Grammar1",
        "Grammar2",
        "Clarity1",
        "Clarity2",
        "Engagement1",
        "Engagement2",
      ]);
      expect(result.GrammarCorrectionHeaderMistakeWhatToDoArray).toEqual([
        "Fix1",
        "Fix2",
        "Improve1",
        "Improve2",
        "ImproveEngagement1",
        "ImproveEngagement2",
      ]);
      expect(result.GrammarCorrectionColorArray).toEqual([
        SharedColors.red10,
        SharedColors.red10,
        SharedColors.blue10,
        SharedColors.blue10,
        SharedColors.green10,
        SharedColors.green10,
      ]);

      expect(result.GrammarCorrectionContentArray.length).toBe(6);
    });
  });
});

describe("getClassifiedAndRearrangedByTypeOfCorrectionObject", () => {
  test("classifies and rearranges corrections", () => {
    const mockParsedJSON: Array<AccordionObject> = [
      {
        type: typeOfCorrection.Correctness,
        word: "Grammar1",
        whatToDo: "Fix1",
        originalText: "Old1",
        correctedText: "New1",
      },
      {
        type: typeOfCorrection.Correctness,
        word: "Grammar2",
        whatToDo: "Fix2",
        originalText: "Old2",
        correctedText: "New2",
      },
      {
        type: typeOfCorrection.Clarity,
        word: "Clarity1",
        whatToDo: "Improve1",
        originalText: "Unclear1",
        correctedText: "Clear1",
      },
      {
        type: typeOfCorrection.Clarity,
        word: "Clarity2",
        whatToDo: "Improve2",
        originalText: "Unclear2",
        correctedText: "Clear2",
      },
    ];

    const newState = getClassifiedAndRearrangedByTypeOfCorrectionObject(mockParsedJSON, typeOfCorrection.Correctness);

    expect(newState[typeOfCorrection.Correctness].total).toBe(2);
    expect(newState[typeOfCorrection.Correctness].content.length).toBe(2);
    expect(newState[typeOfCorrection.Correctness].indexMainContent).toBe(-1);

    expect(newState[typeOfCorrection.Clarity].total).toBe(2);
    expect(newState[typeOfCorrection.Clarity].content.length).toBe(2);
    expect(newState[typeOfCorrection.Clarity].indexMainContent).not.toBe(-1);

    const newStateDifferentCurrentType = getClassifiedAndRearrangedByTypeOfCorrectionObject(
      mockParsedJSON,
      typeOfCorrection.Clarity
    );

    expect(newStateDifferentCurrentType[typeOfCorrection.Correctness].total).toBe(2);
    expect(newStateDifferentCurrentType[typeOfCorrection.Correctness].content.length).toBe(2);
    expect(newStateDifferentCurrentType[typeOfCorrection.Correctness].indexMainContent).not.toBe(-1);

    expect(newStateDifferentCurrentType[typeOfCorrection.Clarity].total).toBe(2);
    expect(newStateDifferentCurrentType[typeOfCorrection.Clarity].content.length).toBe(2);
    expect(newStateDifferentCurrentType[typeOfCorrection.Clarity].indexMainContent).toBe(-1);

    const newStateEmptyCurrentType = getClassifiedAndRearrangedByTypeOfCorrectionObject(
      mockParsedJSON,
      typeOfCorrection.StyleGuide
    );

    expect(newStateEmptyCurrentType[typeOfCorrection.Correctness].total).toBe(2);
    expect(newStateEmptyCurrentType[typeOfCorrection.Correctness].content.length).toBe(2);
    expect(newStateEmptyCurrentType[typeOfCorrection.Correctness].indexMainContent).not.toBe(-1);

    expect(newStateEmptyCurrentType[typeOfCorrection.Clarity].total).toBe(2);
    expect(newStateEmptyCurrentType[typeOfCorrection.Clarity].content.length).toBe(2);
    expect(newStateEmptyCurrentType[typeOfCorrection.Clarity].indexMainContent).not.toBe(-1);
  });

  test("handles empty parsedJSON", () => {
    const newState = getClassifiedAndRearrangedByTypeOfCorrectionObject([], typeOfCorrection.Correctness);

    Object.values(newState).forEach((value: typeOfCorrectionDictionaryEntry) => {
      expect(value.total).toBe(0);
      expect(value.content.length).toBe(0);
      expect(value.indexMainContent).not.toBe(-1);
    });
  });

  test("handles currentTypeOfCorrection with no content", () => {
    const mockParsedJSON: Array<AccordionObject> = [
      {
        type: typeOfCorrection.Clarity,
        word: "Clarity1",
        whatToDo: "Improve1",
        originalText: "Unclear1",
        correctedText: "Clear1",
      },
    ];

    const newState = getClassifiedAndRearrangedByTypeOfCorrectionObject(mockParsedJSON, typeOfCorrection.Correctness);

    expect(newState[typeOfCorrection.Correctness].total).toBe(0);
    expect(newState[typeOfCorrection.Correctness].content.length).toBe(0);
    expect(newState[typeOfCorrection.Correctness].indexMainContent).not.toBe(-1);

    expect(newState[typeOfCorrection.Clarity].total).toBe(1);
    expect(newState[typeOfCorrection.Clarity].content.length).toBe(1);
  });
});
