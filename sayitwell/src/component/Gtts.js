import React, { useState } from 'react';
import axios from 'axios';

const Gtts = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleTranscription = async () => {
    if (!audioFile) {
      setError('Please upload an audio file.');
      return;
    }

    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', audioFile);

    try {
      // Upload the file to a publicly accessible URL (mocked for simplicity)
      const uploadResponse = await axios.post('https://api.yourfileuploadservice.com/upload', formData);
      const audioUrl = uploadResponse.data.url;

      console.log('Audio file uploaded successfully:', audioUrl);

      const response = await axios.post('http://localhost:5000/transcribe', { audioUrl });
      setTranscription(response.data);
    } catch (err) {
      console.error('Error during transcription:', err);
      setError('An error occurred during transcription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Audio to Text Transcription</h1>
      <input type="file" accept="audio/*" onChange={handleFileUpload} />
      <button onClick={handleTranscription} disabled={loading}>
        {loading ? 'Processing...' : 'Transcribe'}
      </button>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      {transcription && (
        <div>
          <h2>Transcription Result</h2>
          <p>{transcription.text}</p>

          {transcription.utterances && (
            <div>
              <h3>Utterances</h3>
              <ul>
                {transcription.utterances.map((utterance, index) => (
                  <li key={index}>
                    Speaker {utterance.speaker}: {utterance.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Gtts;
