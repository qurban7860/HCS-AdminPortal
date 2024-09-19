import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFAutocomplete.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  loading: PropTypes.bool,
  helperText: PropTypes.node,
  Error: PropTypes.bool,
  nonEditable: PropTypes.bool,
};

export default function RHFAutocomplete({ name, label, loading = false, helperText, Error, nonEditable, ...other }) {
  const { control, setValue } = useFormContext();
  
  const nonEditableProperties = {
    readOnly: true,
    style: { cursor: 'pointer' }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          loading={loading}
          onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
          renderInput={(params) => (
            <TextField
              label={label}
              error={!!error || !!Error}
              helperText={error ? error?.message : helperText}
              inputProps={{
                ...params.inputProps,
                ...(nonEditable && nonEditableProperties),
              }}
              {...params}
            />
          )}
          {...other}
        />
      )}
    />
  );
}
