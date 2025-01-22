import React, { useState, useRef } from "react";

const RecordingsList = ({ onAssess, setRecordings, recordings }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleToggleRecord = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const newRecording = { url: audioUrl, blob: audioBlob };
        
        // Update recordings list
        setRecordings((prev) => [...prev, newRecording]);

        // Optional: Send the audioBlob to the backend
        onAssess(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="recordings-list">
      <button onClick={handleToggleRecord}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <ul>
        {recordings.map((rec, index) => (
          <li key={index}>
            <audio src={rec.url} controls></audio>
            <button onClick={() => onAssess(rec.blob)}>Assess</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordingsList;
