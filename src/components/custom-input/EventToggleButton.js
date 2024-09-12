import PropTypes from 'prop-types';
import React from 'react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

EventToggleButton.propTypes = {
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

function EventToggleButton( { value, handleChange } ) {
  return (
    <ToggleButtonGroup
    size="small"
    value={value}
    onChange={handleChange}
    sx={{
      m: 1,
    }}
    exclusive
    aria-label="Platform"
  >
    <ToggleButton 
      value="customerVisit" 
      sx={{ 
        fontSize: '1.1rem',
        fontWeight: 'bold',
        '&.Mui-selected': {
          backgroundColor: 'rgba(0, 123, 255, 0.3)',
        },
        py:-2
      }}
    >
      Customer Visit
    </ToggleButton>
    <ToggleButton 
      value="InternalTask" 
      sx={{ 
        fontSize: '1.1rem',
        fontWeight: 'bold',
        '&.Mui-selected': {
          backgroundColor: 'rgba(0, 123, 255, 0.3)',
        },
        py:-2
      }}
    >
      Internal Task
    </ToggleButton>
  </ToggleButtonGroup>
  )
}

export default EventToggleButton
