import React, { useState, useRef } from "react";
import axios from "axios";
import TextArea from "./TextArea";

const GetTongueTwister = () => {
  const [tongueTwister, setTongueTwister] = useState(""); // Manage the tongue twister text
  const [audioUrl, setAudioUrl] = useState(""); // Store the audio URL for playback
  const [isRecording, setIsRecording] = useState(false); // To track recording status
  const mediaRecorderRef = useRef(null); // MediaRecorder reference
  const chunksRef = useRef([]); // To store chunks of audio data

  const fetchTongueTwister = async () => {
    try {
      const response = await axios.post("http://localhost:5000/gettonguetwister"); // Call backend endpoint
      setTongueTwister(response.data.tt); // Set the fetched tongue twister
    } catch (error) {
      console.error("Error fetching tongue twister:", error);
      setTongueTwister("Failed to fetch a tongue twister. Try again!"); // Error message fallback
    }
  };

  const handleLearnPronunciation = () => {
    if (!tongueTwister) {
      alert("Please enter a tongue twister or text to pronounce!");
      return;
    }

    // Start recording audio
    startRecording();

    // Create a SpeechSynthesisUtterance
    const speech = new SpeechSynthesisUtterance(tongueTwister);
    speech.lang = "en-US"; // Specify language
    speech.rate = 0.9; // Set the speech rate for clarity

    // When the speech starts, log the action
    speech.onstart = () => {
      console.log("Speech started");
    };

    // After the speech ends, stop the recording
    speech.onend = () => {
      console.log("Speech ended");
      stopRecording();
    };

    // Trigger pronunciation
    window.speechSynthesis.speak(speech);
  };

  // Handle changes in the text area
  const handleTextChange = (event) => {
    setTongueTwister(event.target.value); // Update the text area with the user's input
  };

  // Start recording function
  const startRecording = async () => {
    // Start capturing audio through MediaRecorder
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
      setAudioUrl(audioUrl); // Set the audio URL for replay
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  // Stop recording function
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  return (
    <div className="tongue-twister-container">
      <button className="fetch-button" onClick={fetchTongueTwister}>
        Generate Tongue Twister
      </button>

      <button className="learn-button" onClick={handleLearnPronunciation}>
        Learn Pronunciation
      </button>

      {/* Editable TextArea Component */}
      <TextArea 
        value={tongueTwister} 
        onChange={handleTextChange} 
        placeholder="Enter your own text or use the generated tongue twister..." 
      />

      {/* Display the generated audio if available */}
      {audioUrl && (
        <div>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
};

export default GetTongueTwister;
