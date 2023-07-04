import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, Autocomplete } from '@mui/material';

function DocumentMachineAddForm({
  disabled,
  Value,
  SubValue,
  options,
  SubOptions,
  onChange,
  SubOnChange,
  renderInput,
  SubRenderInput,
}) {
  const [machineVal, setMachineVal] = useState('');
  const [machineModelVal, setMachineModelVal] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [nameVal, setNameVal] = useState('');
  const [displayNameVal, setDisplayNameVal] = useState('');

  return (
    <Grid container>
      <Grid container spacing={2}>
        <Grid item lg={6}>
          <Autocomplete
            // freeSolo
            disabled={disabled}
            // readOnly={readOnlyVal}
            value={Value}
            options={options}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => `${option.name ? option.name : ''}`}
            onChange={onChange}
            renderOption={(props, option) => (
              <li {...props} key={option._id}>
                {option.name}
              </li>
            )}
            id="controllable-states-demo"
            renderInput={renderInput}
            ChipProps={{ size: 'small' }}
          />
        </Grid>

        <Grid item lg={6}>
          <Autocomplete
            // freeSolo
            value={SubValue}
            options={SubOptions}
            // isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => `${option.serialNo ? option.serialNo : ''}`}
            onChange={SubOnChange}
            // renderOption={(props, option) => (<li  {...props} key={option._id}>{option.name}</li>)}
            id="controllable-states-demo"
            renderInput={(params) => <TextField {...params} label="Select Machine" />}
            ChipProps={{ size: 'small' }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

DocumentMachineAddForm.propTypes = {
  disabled: PropTypes.bool,
  Value: PropTypes.string,
  SubValue: PropTypes.string,
  options: PropTypes.array,
  SubOptions: PropTypes.array,
  onChange: PropTypes.func,
  SubOnChange: PropTypes.func,
  renderInput: PropTypes.func,
  SubRenderInput: PropTypes.func,
};

export default DocumentMachineAddForm;
