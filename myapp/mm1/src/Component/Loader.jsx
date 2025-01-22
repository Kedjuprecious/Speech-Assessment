import React from 'react';

const Loader = ({id, style }) => {
  return (
     <div id={id} style = {style} >
         <div id="loader"></div>
     </div>
  );
};

export default Loader;