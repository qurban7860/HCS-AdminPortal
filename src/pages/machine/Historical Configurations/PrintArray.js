import PropTypes from 'prop-types';
import React, { useState, memo } from 'react';
// import { getColorForType , printValue } from './Utils'

function PrintArray(arr, depth){

    const [isOpenPrintArray, setIsOpenPrintArray] = useState(true);
  
    const toggleOpenPrintArray = () => {
      setIsOpenPrintArray(!isOpenPrintArray);
    };
  
    const handleKeyPressPrintArray = (event) => {
      if (event.key === 'Enter') {
        toggleOpenPrintArray();
      }
    };
    const indent = '                          '.repeat(depth);
  
    return (
      <div>
      <button
        type="button"
        onClick={toggleOpenPrintArray}
        onKeyPress={handleKeyPressPrintArray}
        style={{
          color: isOpenPrintArray ? 'blue' : 'black',
          cursor: 'pointer',
          outline: 'none', // Remove the default outline on focus
          border: 'none', // Remove the default button border
          background: 'none', // Make the button background transparent
          padding: 0, // Remove any default padding
          fontSize: 'inherit', // Inherit the font size
        }}
      >
        {isOpenPrintArray ? '{' : '[...]'}
      </button>
  
        {isOpenPrintArray && (
            <div style={{ marginLeft: '35px' }}>
            {arr.map( 
              (item, indexPrintArray ) => (
                <div key={indexPrintArray} >
                  <span style={{ color: getColorForType(item) }}>{printValue(item, depth + 1)}</span>
                </div>)
                )}
            </div>
        )}
  
        {isOpenPrintArray && <span>{indent}</span>}
      </div>
    );
  };
  
  export default memo(PrintArray);