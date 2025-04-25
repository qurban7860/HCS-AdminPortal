import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { Autocomplete, TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFAutocomplete.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  loading: PropTypes.bool,
  helperText: PropTypes.node,
  Error: PropTypes.bool,
  nonEditable: PropTypes.bool,
  valueField: PropTypes.string,
};

export default function RHFAutocomplete({
  name,
  label,
  loading = false,
  helperText,
  Error,
  nonEditable,
  placeholder,
  valueField = null,
  ...other
}) {
  const { control, setValue } = useFormContext();

  const nonEditableProperties = {
    readOnly: true,
    style: { cursor: 'pointer' },
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          loading={loading}
          onChange={(event, newValue) => {
            // If valueField is specified, only save that field
            if (valueField && newValue) {
              setValue(name, newValue?.[valueField], { shouldValidate: true });
            } else {
              setValue(name, newValue, { shouldValidate: true });
            }
          }}
          renderInput={(params) => (
            <TextField
              label={label}
              placeholder={placeholder || null}
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
