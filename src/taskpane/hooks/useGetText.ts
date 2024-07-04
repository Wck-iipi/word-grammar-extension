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

const useGetText = () => {
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

  return [text, loading, error];
};

export default useGetText;
