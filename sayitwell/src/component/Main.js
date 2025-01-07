import React from "react";
import useSpeechRecognition from "../hooks/useSpeechRecognitionHooks";

const Main = () => {
  // Use the speech recognition hook
  const {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  return (
    <div>
      {hasRecognitionSupport ? (
        <>
          <div>
            <button onClick={startListening}>Start Listening</button>
          </div>
          <div>
            <button onClick={stopListening}>Stop Listening</button>
          </div>

          {isListening && <div>Your browser is currently listening...</div>}
          <div>
            <strong>Transcript:</strong> {text}
          </div>
        </>
      ) : (
        <h1>Your browser does not support speech recognition.</h1>
      )}
    </div>
  );
};

export default Main;
