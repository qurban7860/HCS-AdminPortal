import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
  Error: PropTypes.bool,
  isFocused: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default function RHFTextField({ name, helperText, Error, isFocused, onFocus, onBlur, ...other }) { 
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          error={!!error || !!Error}
          helperText={error ? error?.message : helperText}
          onFocus={onFocus} 
          onBlur={onBlur}  
          {...other}
        />
      )}
    />
  );
}