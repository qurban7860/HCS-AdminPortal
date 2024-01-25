import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import {
  TextField,
} from '@mui/material';

RHFDatePicker.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  size: PropTypes.string,
  helperText: PropTypes.node,
  Error: PropTypes.bool,
};

export default function RHFDatePicker({ name, label, size, helperText, Error, ...other }) {

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          name="serviceDate"
          label={label}
          onChange={newValue => field.onChange(newValue)}
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

