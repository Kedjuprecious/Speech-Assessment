import React, { useState } from "react";

const MicButton = ({ onRecordingComplete, isRecording, setIsRecording }) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const handleStartRecording = async () => {
    try {
      console.log("Attempting to start recording...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const audioChunks = [];
      recorder.ondataavailable = (event) => {
        console.log("Data available:", event.data);
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        console.log("Stopping recording...");
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        console.log("Audio Blob created:", audioBlob);
        onRecordingComplete(audioBlob);
      };

      recorder.start();
      console.log("Recording started.");
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to record your speech.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      console.log("Stopping the media recorder...");
      mediaRecorder.stop();
      setIsRecording(false);
    } else {
      console.warn("Media recorder is not initialized.");
    }
  };

  return (
    <button
      onClick={isRecording ? handleStopRecording : handleStartRecording}
      className={isRecording ? "recording-btn" : "start-btn"}
      title={isRecording ? "Stop recording your speech" : "Start recording your speech"}
    >
      {isRecording ? "Stop Recording" : "Start Recording"}
    </button>
  );
};

export default MicButton;
