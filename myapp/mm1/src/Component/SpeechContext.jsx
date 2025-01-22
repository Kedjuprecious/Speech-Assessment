import React, { createContext, useState, useContext } from 'react';

// Create the context
const SpeechContext = createContext();

// Create the provider
const SpeechProvider = ({ children }) => {
    const [at, setToken] = useState("");
    const [reftext, setRefText] = useState("");
    const [story, setStory] = useState([]);
    const [tts, setTts] = useState("");
    const [offsets, setOffsets] = useState([]);
    const [wordAudios, setWordAudios] = useState([]);
    const [recording, setRecording] = useState([]);
    const [metrics, setMetrics] = useState({
        accuracyScore: "",
        fluencyScore: "",
        completenessScore: "",
        pronScore: "",
        wordsOmitted: "",
        wordsInserted: ""
    });
    const [words, setWords] = useState([]);

    return (
      <SpeechContext.Provider
        value={{
          at,
          setToken,
          reftext,
          setRefText,
          story,
          setStory,
          tts,
          setTts,
          offsets,
          setOffsets,
          wordAudios,
          setWordAudios,
          recording,
          setRecording,
          metrics,
          setMetrics,
          words,
          setWords
        }}
      >
        {children}
      </SpeechContext.Provider>
    );
};
// Create the hook
const useSpeech = () => {
  return useContext(SpeechContext);
};

export { SpeechProvider, useSpeech };