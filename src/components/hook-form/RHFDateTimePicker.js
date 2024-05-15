import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { DateTimePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';

RHFDateTimePicker.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  size: PropTypes.string,
  helperText: PropTypes.node,
  Error: PropTypes.bool,
};

export default function RHFDateTimePicker({ name, label, size, helperText, Error, ...other }) {

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
            <DateTimePicker
              {...field}
              name="serviceDate"
              inputFormat="dd/MM/yyyy hh:mm aa"
              label={label}
              onChange={newValue => field.onChange(newValue)}
              viewRenderers={{
                hours: null,
                minutes: null,
                seconds: null,
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  size={size}
                  error={!!error || !!Error}
                  helperText={error ? error?.message : helperText}
                />
              )}
              {...other}
              // InputAdornmentProps={{ style: { display: 'none' } }}
            />
      )}
    />
  );
}

