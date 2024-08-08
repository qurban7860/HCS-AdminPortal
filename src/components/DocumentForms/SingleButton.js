import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from '@mui/material';

SingleButton.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  type: PropTypes.string,
  m: PropTypes.string,
  sx: PropTypes.object,
};

export default function SingleButton({ loading, disabled, name, type='submit', variant='contained', size='large', m, sx }) {
  return (
    <Grid item xs={18} md={3} display="flex">
      <Button
        variant={variant}
        type={type}
        size={size}
        loading={loading}
        disabled={disabled}
        fullWidth
        {...sx}
      >
        {name}
      </Button>
    </Grid>
  );
}
