import React, { useState } from "react";
import { Container, Segment } from "semantic-ui-react";
import { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';

function App() {
  const [text, setText] = useState('');
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();

  const handleOnClick = () => {
    // Convert the text to speech when the button is clicked
    speak({ text });
  };

  const startListening = () => {
    // Start speech recognition
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  };

  const stopListening = () => {
    // Stop speech recognition
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  return (
    <Container>
      <Segment>
        <h1>Text to Speech and Speech to Text Converter in React</h1>

        {/* Text area for speech-to-text functionality */}
        <textarea
          className="textAreaStyle"
          value={transcript}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        
        {/* Buttons for listening and converting speech to text */}
        <button onClick={startListening}>
          Start Listening
        </button>
        <button onClick={stopListening}>
          Stop Listening
        </button>

        {/* Displaying the transcript */}
        <p>Transcript: {transcript}</p>

        {/* Button for text-to-speech functionality */}
        <button onClick={handleOnClick}>Listen to Text</button>

        {/* Displaying the current text */}
        <p>{text}</p>
      </Segment>
    </Container>
  );
}

export default App;
