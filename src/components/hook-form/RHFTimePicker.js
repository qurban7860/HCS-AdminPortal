import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { TimePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';

RHFTimePicker.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  size: PropTypes.string,
  helperText: PropTypes.node,
  Error: PropTypes.bool,
};

export default function RHFTimePicker({ name, label, size, helperText, Error, ...other }) {

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TimePicker
          {...field}
          onChange={(newValue) => field.onChange(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              size={size}
              readOnly
              inputProps={{
                ...params.inputProps,
                readOnly: true,
              }}
              error={!!error || !!Error}
              helperText={error ? error?.message : helperText}
            />
          )}
          {...other}
        />
      )}
    />
  );
}

