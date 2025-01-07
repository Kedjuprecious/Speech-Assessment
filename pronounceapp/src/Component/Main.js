import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [gender, setGender] = useState('NEUTRAL');
  const [audioUrl, setAudioUrl] = useState('');

  const handleGenerate = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/pronounce', {
        text,
        languageCode: language,
        voiceGender: gender,
      });
      setAudioUrl(response.data.audioUrl);
    } catch (error) {
      console.error('Error generating pronunciation:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Pronunciation App</h1>
      <div>
        <label>Text to Pronounce:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text"
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
          <option value="fr-FR">French</option>
          <option value="es-ES">Spanish</option>
        </select>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>Voice Gender:</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="NEUTRAL">Neutral</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
      </div>
      <button
        onClick={handleGenerate}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: 'blue',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Generate Pronunciation
      </button>
      {audioUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>Generated Audio:</h3>
          <audio controls>
            <source src={audioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

export default App;
