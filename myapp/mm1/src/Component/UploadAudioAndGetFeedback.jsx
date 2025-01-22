import React from "react";
import "./TextArea.css";

const TextArea = ({ value, placeholder }) => {
  return (
    <textarea className="text-area" value={value} readOnly placeholder={placeholder} />
  );
};

export default TextArea;
