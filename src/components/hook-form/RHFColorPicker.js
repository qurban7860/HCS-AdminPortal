import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from '../iconify';

// ----------------------------------------------------------------------
RHFColorPicker.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
};

export default function RHFColorPicker({ name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value = field.value || '';

        return (
          <TextField
            {...field}
            fullWidth
            type="text"
            value={value}
            onChange={(event) => {
              const val = event.target.value;
              field.onChange(val);
            }}
            error={!!error}
            helperText={error?.message ?? helperText}
            inputProps={{ autoComplete: 'off' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="mdi:circle" width={25} sx={{ color: value, border: '1px solid #ccc', borderRadius: '50%' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton component="label" sx={{ p: 0 }}>
                    <Box component="input" type="color" value={value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      sx={{ width: 30, opacity: 0, position: 'absolute', cursor: 'pointer' }}
                    />
                    <Iconify icon="emojione:artist-palette" width={25} sx={{ cursor: 'pointer' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            {...other}
          />
        );
      }}
    />
  );
}