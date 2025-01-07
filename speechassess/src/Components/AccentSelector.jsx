import React from "react";

const AccentSelector = ({ selectedAccent, onAccentChange }) => {
  const accents = ["en-US", "en-GB", "en-AU", "en-CA"];

  return (
    <div className="accent-selector">
      <label htmlFor="accent-select">Choose your preferred accent:</label>
      <select
        id="accent-select"
        value={selectedAccent}
        onChange={(e) => onAccentChange(e.target.value)}
      >
        {accents.map((accent) => (
          <option key={accent} value={accent}>
            {accent}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AccentSelector;
