import React from 'react';

const CopyToClipboardButton = ({ textToCopy }) => {
  const handleCopy = () => {
    if (!textToCopy) {
      alert('No text available to copy.');
      return;
    }

    navigator.clipboard.writeText(textToCopy).then(
      () => {
        alert('Text copied to clipboard!');
        console.log('Copied text:', textToCopy);
      },
      (err) => {
        alert('Failed to copy text. Please try again.');
        console.error('Error copying text:', err);
      }
    );
  };

  return (
    <button onClick={handleCopy} className="toolbar-btn" title="Copy to Clipboard">
      <i className="fas fa-copy toolbar-i"></i>
    </button>
  );
};

export default CopyToClipboardButton;
