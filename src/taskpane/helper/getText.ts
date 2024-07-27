/* global Word console */

async function getTextAsync() {
  try {
    let bodyText = "";

    await Word.run(async (context) => {
      const body = context.document.body;
      body.load("text");
      await context.sync();
      bodyText += body.text;
    });

    return bodyText;
  } catch (error) {
    console.error("Error fetching text:", error);
    return null;
  }
}

const getText = async () => {
  let text: string = null;
  let error: string = null;

  try {
    const fetchedText = await getTextAsync();
    text = fetchedText;
  } catch (errorText) {
    error = errorText;
  }

  return { text, error };
};

export default getText;
