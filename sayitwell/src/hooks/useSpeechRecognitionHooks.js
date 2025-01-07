import { useState, useEffect } from "react";

const useSpeechRecognition = () => {
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);

    let recognition = null;
    if ('webkitSpeechRecognition' in window) {
        recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'en-US';
    }

    useEffect(() => {
        if (!recognition) return;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setText(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            if (isListening) recognition.start(); // Restart if user expects continuous listening
        };

        // Clean up the recognition instance on unmount
        return () => {
            if (recognition) recognition.abort();
        };
    }, [isListening]); // Dependency array includes `isListening`

    const startListening = () => {
        if (isListening) return; // Avoid overlap
        setText('');
        setIsListening(true);
        recognition.start();
    };

    const stopListening = () => {
        setIsListening(false);
        recognition.stop();
    };

    return {
        text,
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport: !!recognition,
    };
};

export default useSpeechRecognition;
