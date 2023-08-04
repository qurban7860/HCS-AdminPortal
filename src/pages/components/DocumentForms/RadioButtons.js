import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import { DocRadioValue, DocRadioLabel } from '../../../constants/document-constants';

export default function RadioButtons({
  value,
  radioOnChange,
  newLabel,
  newValue,
  secondValue,
  secondLabel,
  radioDisaled,
  ... props
}) {
  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={radioOnChange}
      >
        <Grid item xs={12} sm={6}>
          <FormControlLabel 
            item 
            disabled={radioDisaled} 
            sm={6} 
            value={newValue} 
            control={<Radio />} 
            label={newLabel} 
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            item
            disabled={radioDisaled}
            sm={6}
            value={secondValue}
            control={<Radio />}
            label={secondLabel}
          />
        </Grid>
      </RadioGroup>
    </FormControl>
  );
}

RadioButtons.propTypes = {
  value: PropTypes.string,
  radioOnChange: PropTypes.func,
  newValue: PropTypes.string,
  newLabel: PropTypes.string,
  secondValue: PropTypes.string,
  secondLabel: PropTypes.string,
  radioDisaled: PropTypes.bool,
};
