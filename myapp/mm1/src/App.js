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

  const handleGetTongueTwister = async () => {
    const tt = await getTongueTwister();
    setTongueTwister(tt);
  };

  const handleAssessPronunciation = async (audioBlob) => {
    const result = await assessPronunciation(audioBlob, tongueTwister);
    setMetrics(result); // Make sure result contains the correct structure
  };

  return (
    <div className="app">
      <h1>Pronunciation Assessment</h1>
      <TongueTwister text={tongueTwister} />
      {/* <Button onClick={handleGetTongueTwister} label="Get Tongue Twister" /> */}
      <RecordingsList onAssess={handleAssessPronunciation} setRecordings={setRecordings} recordings={recordings} />
      {metrics && <MatricsTable metrics={metrics} />}
    </div>
  );
}

export default App;
