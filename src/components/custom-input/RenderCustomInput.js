import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { TextField } from '@mui/material';
import PriorityIcon from '../../pages/calendar/utils/PriorityIcon'; 

const RenderCustomInput = ({ params, label }) => {
  const [isFocused, setIsFocused] = useState(false);
  const selectedOption = params?.inputProps?.value;
  const showLabelAsShrunk = isFocused || Boolean(selectedOption);

  return (
    <TextField
      {...params}
      label={label}
      InputProps={{
        ...params?.InputProps,
        startAdornment: selectedOption ? (
          <PriorityIcon priority={selectedOption} />
        ) : null,
        onFocus: (event) => {
          setIsFocused(true);
          params?.InputProps?.onFocus?.(event);
        },
        onBlur: (event) => {
          setIsFocused(false);
          params?.InputProps?.onBlur?.(event);
        },
      }}
      InputLabelProps={{
        ...params?.InputLabelProps,
        shrink: showLabelAsShrunk,
      }}
    />
  );
};

export default RenderCustomInput;

RenderCustomInput.propTypes = {
    params: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
};