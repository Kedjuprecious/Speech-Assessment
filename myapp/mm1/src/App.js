import React, { useState } from "react";
import TextArea from "./Component/TextArea";
import TongueTwister from "./Component/GetTongueTwister";
import Button from "./Component/Button";
import RecordingsList from "./Component/RecordingList";
import MatricsTable from "./Component/MatricsTable";
import { getTongueTwister, assessPronunciation } from "./api";

function App() {
  const [tongueTwister, setTongueTwister] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [isTongueTwisterLoaded, setIsTongueTwisterLoaded] = useState(false); // Track if the tongue twister is fetched

  const handleGetTongueTwister = async () => {
    try {
      const tt = await getTongueTwister(); // Fetch tongue twister from backend
      setTongueTwister(tt);
      setIsTongueTwisterLoaded(true); // Set to true once the tongue twister is loaded
    } catch (error) {
      console.error("Error fetching tongue twister:", error);
    }
  };

  const handleAssessPronunciation = async (audioBlob) => {
    if (!tongueTwister) {
      console.error("Tongue twister is not available");
      return;
    }
  
    try {
      const result = await assessPronunciation(audioBlob, tongueTwister);  // Send the audio and reference text
      if (result) {
        console.log("Received result:", result);
        setMetrics(result);  // Store the metrics
      }
    } catch (error) {
      console.error("Error assessing pronunciation:", error);
    }
  };
  

  return (
    <div className="app">
      <h1>Pronunciation Assessment</h1>
      <TongueTwister tongueTwister={tongueTwister} setTongueTwister={setTongueTwister} />
      <Button onClick={handleGetTongueTwister}>Get Tongue Twister</Button>
      <RecordingsList 
        onAssess={handleAssessPronunciation}
        setRecordings={setRecordings} 
        recordings={recordings} 
        tongueTwister={tongueTwister}
        disabled={!isTongueTwisterLoaded} // Disable recording until tongue twister is fetched
      />
      {metrics && <MatricsTable metrics={metrics} />}
    </div>
  );
}

export default App;
