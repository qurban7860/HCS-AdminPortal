import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import {
  FormLabel,
  FormGroup,
  FormControl,
  FormHelperText,
  FormControlLabel,
  TextField,
} from '@mui/material';

RHFDatePicker.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
  Error: PropTypes.bool,
};

export default function RHFDatePicker({ name, label, helperText, Error, ...other }) {

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

