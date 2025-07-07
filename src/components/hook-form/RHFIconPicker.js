import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  TextField,
  InputAdornment,
  IconButton,
  Stack
} from '@mui/material';
import PropTypes from 'prop-types';
import Iconify from '../iconify';
import IconPickerPopover from './IconPickerPopover';

RHFIconPicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  color: PropTypes.string,
};

export default function RHFIconPicker({ name, label, color = 'inherit' }) {
  const { control } = useFormContext();
  const [anchorEl, setAnchorEl] = useState(null);

  const openPicker = (e) => setAnchorEl(e.currentTarget);
  const closePicker = () => setAnchorEl(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack spacing={1}>
          <TextField
            {...field}
            label={label}
            fullWidth
            error={!!error}
            helperText={error?.message}
            onChange={(e) => field.onChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {field.value && (
                    <Iconify
                      icon={field.value}
                      sx={{ mr: 1, width: 24, height: 24, color }}
                    />
                  )}
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={openPicker} size="small">
                    <Iconify icon="mdi:dots-grid" width={25} sx={{ cursor: 'pointer' }} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <IconPickerPopover
            anchorEl={anchorEl}
            onClose={closePicker}
            onSelect={(icon) => {
              field.onChange(icon);
              closePicker();
            }}
          />
        </Stack>
      )}
    />
  );
}