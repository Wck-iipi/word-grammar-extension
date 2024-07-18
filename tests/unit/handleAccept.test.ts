import { __test__ } from "@taskpane/helper/handleAccept";

const { replaceWithStyleMaintained } = __test__;

describe("replaceWithStyleMaintained", () => {
  test("replaces added words", () => {
    const innerHTML = "This is a test with <b>error.</b>";
    const originalText = "This is a test with error.";
    const correctedText = "This is a test with an error.";
    const expectedResult = "This is a test with an <b>error.</b>";

    const result = replaceWithStyleMaintained(innerHTML, originalText, correctedText);

    expect(result).toBe(expectedResult);
  });

  test("replaces added words in beggining", () => {
    const innerHTML = "is a test with <b>error.</b>";
    const originalText = "is a test with error.";
    const correctedText = "This is a test with an error.";
    const expectedResult = "This is a test with an <b>error.</b>";

    const result = replaceWithStyleMaintained(innerHTML, originalText, correctedText);

    expect(result).toBe(expectedResult);
  });

  test("replaces removed words", () => {
    const innerHTML = "This is a <b>test with an error</b>.";
    const originalText = "This is a test with an error.";
    const correctedText = "This is a test.";
    const expectedResult = "This is a <b>test</b>.";

    const result = replaceWithStyleMaintained(innerHTML, originalText, correctedText);

    expect(result).toBe(expectedResult);
  });

  test("replaces words with added and removed words", () => {
    const innerHTML = "This is a <b>wronger</b> sentence.";
    const originalText = "This is a wronger sentence.";
    const correctedText = "This is a wrong sentence.";
    const expectedResult = "This is a <b>wrong</b> sentence.";

    const result = replaceWithStyleMaintained(innerHTML, originalText, correctedText);
    expect(result).toBe(expectedResult);
  });

  test("replaces words with added and removed words 2", () => {
    const innerHTML = "This is right sentence.";
    const originalText = "This is right sentence.";
    const correctedText = "This is a correct sentence.";
    const expectedResult = "This is a correct sentence.";

    const result = replaceWithStyleMaintained(innerHTML, originalText, correctedText);
    expect(result).toBe(expectedResult);
  });

  test("handles mixed changes", () => {
    const innerHTML = "This is a <b>wrong sentence</b>.";
    const originalText = "This is a wrong sentence.";
    const correctedText = "This is a corrected phrase.";
    const expectedResult = "This is a <b>corrected phrase</b>.";

    const result = replaceWithStyleMaintained(innerHTML, originalText, correctedText);

    expect(result).toBe(expectedResult);
  });

  test("handles no changes", () => {
    const innerHTML = "This is a correct sentence";
    const originalText = "This is a correct sentence";
    const correctedText = "This is a correct sentence";

    const result = replaceWithStyleMaintained(innerHTML, originalText, correctedText);

    expect(result).toBe(innerHTML);
  });
});
