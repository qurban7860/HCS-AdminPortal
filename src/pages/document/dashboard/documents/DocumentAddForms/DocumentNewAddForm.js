import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, Autocomplete } from '@mui/material';
import { FORMLABELS } from '../../../../../constants/default-constants';

export default function DocumentNewAddForm({
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
            renderInput={(params) => (
              <TextField {...params} required label={FORMLABELS.SELECT_DOCUMENT_CATEGORY} />
            )}
            ChipProps={{ size: 'small' }}
          />
        </Grid>
        <Grid item lg={6}>
          <Autocomplete
            // freeSolo
            disabled={disabled}
            // readOnly={readOnlyVal}
            value={SubValue}
            options={SubOptions}
            // isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => `${option.name && option.name}`}
            onChange={SubOnChange}
            // renderOption={(props, option) => (<li  {...props} key={option._id}>{option.name}</li>)}
            id="controllable-states-demo"
            renderInput={(params) => (
              <TextField {...params} required label={FORMLABELS.SELECT_DOCUMENT_TYPE} />
            )}
            ChipProps={{ size: 'small' }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

DocumentNewAddForm.propTypes = {
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
