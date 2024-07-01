import { useState, useEffect } from "react";
/* global Word console */

async function getTextAsync() {
  try {
    let bodyText = "";

    await Word.run(async (context) => {
      let body = context.document.body;
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

export const getText = () => {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedText = await getTextAsync();
        setText(fetchedText);
        setLoading(false);
      } catch (error) {
        setError(error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return "Loading...";
  }

  if (error) {
    return `Error: ${error.message}`;
  }

  return "Noice " + text;
};
