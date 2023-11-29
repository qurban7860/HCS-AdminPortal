
import PropTypes from 'prop-types';
import React, { useState, memo } from 'react';
// import PrintObject from './PrintObject';





ObjectPrinter.propTypes = {
  data: PropTypes.object,
};

function ObjectPrinter({ data }) {

  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      toggleOpen();
    }
  };


  return <div style={{ 
    px: 2, py: 2, 
    alignItems: 'center',
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
    wordBreak: 'break-word' 
  }}><PrintObject obj={data} depth={} /></div>;
};

export default memo(ObjectPrinter);