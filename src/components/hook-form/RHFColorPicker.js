import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { HexColorPicker } from 'react-colorful';
import { Popover, TextField, InputAdornment, IconButton } from '@mui/material';
import Iconify from '../iconify';
// ----------------------------------------------------------------------

RHFColorPicker.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
  Error: PropTypes.bool,
};

export default function RHFColorPicker({ name, helperText, Error, ...other }) {

  const { control } = useFormContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const open = Boolean(anchorEl);
  const id = open ? 'color-popover' : undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <TextField
            {...field}
            fullWidth
            value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
            error={!!error || !!Error}
            helperText={error ? error?.message : helperText}
            InputProps={{
              startAdornment: (
                field?.value && !error && <Iconify icon="mdi:square" sx={{ width: '35px', height: '35px' }} color={field?.value || ""} />
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClick} edge="end" >
                    <Iconify icon="mdi:color" sx={{ width: '35px', height: '35px' }} color="Black" />
                  </IconButton>
                </InputAdornment>
              )
            }}
            {...other}
          />
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            PaperProps={{
              sx: {
                overflow: 'visible', // Prevents scrollbars
              },
            }}
          >
            <HexColorPicker
              color={field.value}
              onChange={(color) => field.onChange(color)}
            />
          </Popover>
        </>
      )}
    />
  );
}
