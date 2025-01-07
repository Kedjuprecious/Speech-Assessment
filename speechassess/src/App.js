import React, { useState } from "react";
import SentenceDisplay from "./Components/SentenceDisplay";
import MicButton from "./Components/MicButton";
import ResultsDisplay from "./Components/ResultsDisplay";
import "./App.css";
import { generateRandomSentence } from "./utils/generateRandomSentence";

const App = () => {
  const [currentSentence, setCurrentSentence] = useState(generateRandomSentence());
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState(null); // Track recording results
  const [showResults, setShowResults] = useState(false); // Toggle between results and sentence display
  const [statusMessage, setStatusMessage] = useState(""); // Status messages for recording

  // Handle the completion of the recording
  const handleRecordingComplete = (audioBlob) => {
    console.log("Recording completed successfully:", audioBlob);
    setResults("Recording has been processed successfully."); // Example result text
    setStatusMessage("You have ended recording.");
    setShowResults(true); // Show the results component
  };

  // Handle generating a new sentence
  const handleGenerateNewSentence = () => {
    const newSentence = generateRandomSentence();
    console.log("Generated new sentence:", newSentence);
    setCurrentSentence(newSentence);
    setResults(null); // Clear results when a new sentence is generated
    setShowResults(false); // Return to sentence display view
    setStatusMessage(""); // Clear the status message
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Speech Assessment of English Sentence</h1>
        <p>Please click the microphone and read aloud the following sentence.</p>
      </header>

      {statusMessage && <p className="status-message">{statusMessage}</p>}

      {showResults ? (
        <ResultsDisplay
          results={results}
          onTryAnother={handleGenerateNewSentence}
          onStartRecording={() => {
            setIsRecording(true);
            setStatusMessage("You have started recording.");
          }}
        />
      ) : (
        <SentenceDisplay
          onSentenceChange={setCurrentSentence}
          sentence={currentSentence}
          isRecording={isRecording}
          results={results}
        />
      )}

      {!showResults && (
        <MicButton
          onRecordingComplete={handleRecordingComplete}
          isRecording={isRecording}
          setIsRecording={(recordingStatus) => {
            setIsRecording(recordingStatus);
            setStatusMessage(recordingStatus ? "You have started recording." : "You have ended recording.");
          }}
        />
      )}
    </div>
  );
};

export default App;
