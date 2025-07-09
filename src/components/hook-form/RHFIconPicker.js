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
import IconPickerDialog from '../Dialog/IconPickerDialog';

RHFIconPicker.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  color: PropTypes.string,
};

export default function RHFIconPicker({ name, label, color = 'inherit' }) {
  const { control } = useFormContext();
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

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
            InputProps={{
              startAdornment: field.value && (
                <InputAdornment position="start">
                  <Iconify
                    icon={field.value}
                    sx={{ width: 24, height: 24, color, mr: 1 }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    edge="end" 
                    onClick={openDialog}
                    size="small"
                  >
                    <Iconify icon="mdi:dots-grid" width={25} sx={{ cursor: 'pointer' }} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                '& input': {
                  cursor: 'pointer'
                }
              }
            }}
            onClick={openDialog}
          />

          <IconPickerDialog
            open={dialogOpen}
            onClose={closeDialog}
            onSelect={(icon) => {
              field.onChange(icon);
              closeDialog();
            }}
          />
        </Stack>
      )}
    />
  );
}