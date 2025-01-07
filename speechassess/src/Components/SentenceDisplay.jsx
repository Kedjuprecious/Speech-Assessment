import React, { useState } from "react";
import { generateRandomSentence } from "../utils/generateRandomSentence";

const SentenceDisplay = ({ sentence, onSentenceChange, isRecording, results }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSentence, setNewSentence] = useState("");

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    if (newSentence.trim()) {
      onSentenceChange(newSentence);
      setNewSentence("");
      setIsEditing(false);
    }
  };

  return (
    <div className="sentence-display">
      {isEditing ? (
        <div className="edit-section">
          <input
            type="text"
            placeholder="Write something here"
            value={newSentence}
            onChange={(e) => setNewSentence(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <h2>{sentence}</h2>
      )}

      {!isRecording && (
        <>
          <button onClick={() => onSentenceChange(generateRandomSentence())} className="generate-btn">
            Try Another One
          </button>
          {!results && (
            <button onClick={handleEdit} className="edit-btn">
              Edit
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default SentenceDisplay;
