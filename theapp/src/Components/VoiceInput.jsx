import React, { useState } from 'react';
import UseSpeechToText from './Hooks/UseSpeechToText/SpeechRecognition';
import UploadButton from './UploadButton';
import CopyToClipboardButton from '../CopyToClipboardButton';
import SpeechSynthesisComponent from './SpeechSynthesisComponent';

const VoiceInput = () => {
  const [textInput, setTextInput] = useState('');

  const { isListening, transcript, startListening, stopListening } = UseSpeechToText({ continuous: true });


  const startStopListening = () => {
    console.log('Mic button clicked. Current isListening:', isListening);
    isListening ? stopVoiceInput() : startListening();
  };

  const stopVoiceInput = () => {
  console.log('Stopping voice input. Transcript:', transcript);
    setTextInput((prevVal) =>
      prevVal + (transcript.length ? (prevVal.length ? ' ' : '') + transcript : '')
    );
    console.log('Updated textInput:', textInput);
    stopListening();
  };

  const handleFileUpload = (file) => {
    console.log('File uploaded:', file);
    alert(`Uploaded file: ${file.name}`); 
  };



  return (
    <div className="text-container">
    <textarea
      disabled={isListening}
      className="textarea"
      placeholder="Write here or click on the microphone to speak and have it written here..."
      value={
        isListening
          ? textInput + (transcript.length ? (textInput.length ? ' ' : '') + transcript : '')
          : textInput
      }
      onChange={(e) => {
        console.log('Textarea input changed:', e.target.value);
        setTextInput(e.target.value);
      }}
    ></textarea>
  
    <div className="toolbar">
      <div>
      <UploadButton onFileSelect={handleFileUpload} />
  
      <SpeechSynthesisComponent textToSpeak={textInput} />
  
        <CopyToClipboardButton textToCopy={textInput} />
      </div>
  
      <div>
        <button
          onClick={startStopListening}
          className="mic-btn"
          title={
            isListening
              ? 'Click to stop recording'
              : 'This is a mic, click to start recording. When you end recording, click it again.'
          }
        >
          <i className="fas fa-microphone"></i>
        </button>
      </div>
    </div>
  </div>  
  );
};

export default VoiceInput;
