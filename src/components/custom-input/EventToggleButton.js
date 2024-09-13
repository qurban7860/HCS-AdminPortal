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
    value={value}
    exclusive
    onChange={handleChange}
    size="small"
    aria-label="event-type"
  >
    <ToggleButton value="customerVisit" 
      sx={(theme)=>({ 
        fontSize: '1.1rem',
        fontWeight: 'bold',
        '&.Mui-selected': {
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        },
      })}
      aria-label="customer-event"
    >
      Customer Visit
    </ToggleButton>
    <ToggleButton value="InternalTask" 
      sx={(theme)=>({ 
        fontSize: '1.1rem',
        fontWeight: 'bold',
        '&.Mui-selected': {
          backgroundColor: theme.palette.primary.main,
          color: 'white',
        },
      })}
      aria-label="Internal-event"
    >
      Internal Task
    </ToggleButton>
  </ToggleButtonGroup>
  )
}

export default EventToggleButton
