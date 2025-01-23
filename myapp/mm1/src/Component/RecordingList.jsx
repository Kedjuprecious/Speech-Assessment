import React, { useState, useRef } from "react";

const RecordingsList = ({ onAssess, setRecordings, recordings, tongueTwister }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleToggleRecord = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("Recording stopped");
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        chunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          console.log("Recording stopped, processing...");
          const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
          const audioUrl = URL.createObjectURL(audioBlob);

          // Update recordings list immediately with the raw audio
          setRecordings((prev) => [...prev, { url: audioUrl, blob: audioBlob }]);

          // Send the WAV Blob for assessment along with the reference text
          onAssess(audioBlob, tongueTwister); // Pass reference text (tongueTwister) to the onAssess function
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        console.log("Recording started...");
      } catch (err) {
        console.error("Error starting the recorder:", err);
      }
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordingsList;
