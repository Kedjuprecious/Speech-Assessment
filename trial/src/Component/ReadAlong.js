import React, { useState, useEffect } from "react";
import axios from "axios";

function ReadAlong() {
  const [story, setStory] = useState([]);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [currentSentence, setCurrentSentence] = useState("");

  useEffect(() => {
    fetchStory(0);
  }, []);

  const fetchStory = async (id) => {
    try {
      const response = await axios.post("/getstory", { id });
      if (response.data.code === 200) {
        setStory(response.data.story);
        setCurrentSentence(response.data.story[0]);
      } else {
        setCurrentSentence("--- THE END ---");
      }
    } catch (error) {
      console.error("Failed to fetch story", error);
    }
  };

  const handleNextSentence = () => {
    if (sentenceIndex < story.length - 1) {
      setSentenceIndex(sentenceIndex + 1);
      setCurrentSentence(story[sentenceIndex + 1]);
    } else {
      setCurrentSentence("--- THE END ---");
    }
  };

  return (
    <div>
      <h2>Read Along</h2>
      <p>{currentSentence}</p>
      <button onClick={handleNextSentence}>Next Sentence</button>
    </div>
  );
}

export default ReadAlong;
