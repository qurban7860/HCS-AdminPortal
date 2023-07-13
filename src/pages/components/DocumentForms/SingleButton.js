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
};

SingleButton.defaultProps = {
  variant: 'contained',
  size: 'large',
  type: 'submit',
  m: 1,
};

export default function SingleButton({ loading, disabled, name, type, variant, size, m }) {
  return (
    <Grid item xs={18} md={3} display="flex">
      <Button
        m={m}
        variant={variant}
        type={type}
        size={size}
        loading={loading}
        disabled={disabled}
        fullWidth
      >
        {name}
      </Button>
    </Grid>
  );
}
