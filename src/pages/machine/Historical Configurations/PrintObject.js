import PropTypes from 'prop-types';
import React, { useState, memo } from 'react';
// import { getColorForType , printValue } from './Utils'

function PrintObject(obj, depth = 0){
    const [isOpenPrintObject, setIsOpenPrintObject] = useState(true);
  
    const toggleOpenPrintObject = () => {
      setIsOpenPrintObject(!isOpenPrintObject);
    };
  
    const handleKeyPressPrintObject = (event) => {
      if (event.key === 'Enter') {
        toggleOpenPrintObject();
      }
    };
  
    const indent = '                          '.repeat(depth);
    const keys = Object.keys(obj);
  
    return (
      <div>
      <button
        type="button"
        onClick={toggleOpenPrintObject}
        onKeyPress={handleKeyPressPrintObject}
        style={{
          color: isOpenPrintObject ? 'blue' : 'black',
          cursor: 'pointer',
          outline: 'none', // Remove the default outline on focus
          border: 'none', // Remove the default button border
          background: 'none', // Make the button background transparent
          padding: 0, // Remove any default padding
          fontSize: 'inherit', // Inherit the font size
        }}
      >
        {isOpenPrintObject ? '{' : '{...}'}
      </button>
            {isOpenPrintObject && (
                <div style={{ marginLeft: '15px' }}>
                    {keys.map((key, index) => (
                        <div key={index}>
                            <span style={{ color: 'purple' }}>{key}</span>:&nbsp;
                            <span style={{ color: getColorForType(obj[key]) }}>{printValue(obj[key], depth + 1)}</span>
                        </div>
                    ))}
                </div>
            )}
            <>
                {isOpenPrintObject && <span>{indent}</span>}
            </>
      </div>
    );
  };
  
  export default memo(PrintObject);