import { useState, useEffect, useRef } from 'react';

const UseSpeechToText = ({ continuous = false, lang = 'en-US' }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
       console.error('Web Speech API is not supported in this browser.');
      alert('Web Speech API is not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.interimResults = true;
    recognition.lang = 'en-GB';
    recognition.continuous = continuous;

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
        console.log('Speech recognition result:', text);
      setTranscript(text);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again and ensure your microphone is working.');
        }
      };
      

    recognition.onend = () => {
        console.log('Speech recognition ended.');
      setIsListening(false);
    };

    return () => {
        console.log('Cleaning up speech recognition instance.');
        recognition.stop();
    };  
  }, [lang, continuous]);

  const startListening = () => {
    console.log('Starting speech recognition.');
    if (!isListening && recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    console.log('Stopping speech recognition.');
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, transcript, startListening, stopListening };
};

export default UseSpeechToText;
