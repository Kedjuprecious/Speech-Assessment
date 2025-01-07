import React, { useRef } from 'react';

const UploadButton = ({ onFileSelect }) => {
  const fileInputRef = useRef();

  const handleClick = () => {
    fileInputRef.current.click(); 
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; 
    if (file && onFileSelect) {
      onFileSelect(file); 
    }
  };

  return (
    <>
      <button onClick={handleClick} className="toolbar-btn" title="Upload">
        <i className="fas fa-upload toolbar-i"></i>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }} 
        onChange={handleFileChange}
      />
    </>
  );
};

export default UploadButton;
