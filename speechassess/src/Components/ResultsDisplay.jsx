import React from "react";

const ResultsDisplay = ({ results, onTryAnother, onStartRecording }) => {
  console.log("Displaying results:", results);

  return (
    <div className="results-display">
      <h2>Results</h2>
      <p>{results}</p>

      <button
        onClick={onStartRecording}
        className="start-btn"
        title="Start recording a new speech"
      >
        Start Recording
      </button>

      <button
        onClick={onTryAnother}
        className="generate-btn"
        title="Generate a new sentence for speech assessment"
      >
        Try Another One
      </button>
    </div>
  );
};

export default ResultsDisplay;
