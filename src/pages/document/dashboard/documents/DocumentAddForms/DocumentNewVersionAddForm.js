import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, Autocomplete } from '@mui/material';
import { FORMLABELS } from '../../../../../constants/default-constants';

DocumentNewVersionAddForm.propTypes = {
  disabled: PropTypes.bool,
  Value: PropTypes.string,
  SubValue: PropTypes.string,
  options: PropTypes.array,
  SubOptions: PropTypes.array,
  onChange: PropTypes.func,
  SubOnChange: PropTypes.func,
  renderInput: PropTypes.func,
  SubRenderInput: PropTypes.func,
  getOptionLabel: PropTypes.func,
  renderOption: PropTypes.func,
};

export default function DocumentNewVersionAddForm({
  disabled,
  Value,
  SubValue,
  options,
  SubOptions,
  onChange,
  SubOnChange,
  renderInput,
  SubRenderInput,
  getOptionLabel,
  renderOption,
}) {
  return (
    <Grid container>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <Autocomplete
            // freeSolo
            value={Value}
            options={options}
            // isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => `${option.name ? option.name : ''}`}
            onChange={onChange}
            renderOption={renderOption}
            id="controllable-states-demo"
            renderInput={(params) => (
              <TextField {...params} required label={FORMLABELS.SELECT_DOCUMENT} />
            )}
            ChipProps={{ size: 'small' }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
