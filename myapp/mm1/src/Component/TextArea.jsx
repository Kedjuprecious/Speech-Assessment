import React from "react";

const TextArea = ({ value, onChange, placeholder }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={5}
      cols={50}
    />
  );
};

export default TextArea;
