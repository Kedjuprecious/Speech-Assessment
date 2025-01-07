import React, { useState, useEffect } from 'react';

const SpeechSynthesisComponent = ({ textToSpeak }) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);

  // Load voices on component mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // Set default voice
        if (availableVoices.length > 0) {
          const defaultVoice = localStorage.getItem('preferredVoice');
          setSelectedVoice(defaultVoice || availableVoices[0].name);
        }
      };

      // Load voices and set up event listener for changes
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      alert('Speech synthesis is not supported in this browser.');
    }
  }, []);

  // Save preferred voice to localStorage
  useEffect(() => {
    if (selectedVoice) {
      localStorage.setItem('preferredVoice', selectedVoice);
    }
  }, [selectedVoice]);

  // Handle the "Read Aloud" functionality
  const handleSpeak = () => {
    if (!textToSpeak.trim()) {
      alert('Please enter some text to read aloud.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;

    utterance.onend = () => console.log('Speech finished.');
    utterance.onerror = (err) => console.error('Speech error:', err);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <button onClick={handleSpeak} className="toolbar-btn" title="Read Aloud">
        <i className="fas fa-volume-up toolbar-i"></i>
      </button>

      <div className="dropdown">
        <button className="toolbar-btn" title="Choose Voice">
          <i className="fas fa-caret-down toolbar-i"></i>
        </button>
        <div className="dropdown-content">
          <select
            onChange={(e) => setSelectedVoice(e.target.value)}
            value={selectedVoice || ''}
            className="dropdown-select"
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
          <div>
            <label>
              Pitch:
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
              />
            </label>
            <label>
              Rate:
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
              />
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpeechSynthesisComponent;
