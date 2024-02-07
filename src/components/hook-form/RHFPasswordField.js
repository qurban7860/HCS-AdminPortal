import { useState } from 'react';
import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Iconify from '../iconify';


// ----------------------------------------------------------------------

RHFPasswordField.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
  Error: PropTypes.bool,
};

export default function RHFPasswordField({ name, helperText, Error, ...other }) {
  const [showPassword, setShowPassword] = useState(false);

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={showPassword ? 'text' : 'password'}
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
          error={!!error || !!Error}
          helperText={error ? error?.message : helperText}
          {...other}
        />
      )}
    />
  );
}
