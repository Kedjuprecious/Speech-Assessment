import React, { useRef } from 'react';

const AudioPlayer = ({ src, onEnded }) => {
    const audioRef = useRef(null);

    const handleEnded = () => {
        if (onEnded) {
            onEnded();
        }
    };

  return (
    <audio 
        controls 
        src={src} 
        ref={audioRef} 
        autoPlay
        onEnded={handleEnded}
        id="ttsaudio"
    />
  );
};

export default AudioPlayer;