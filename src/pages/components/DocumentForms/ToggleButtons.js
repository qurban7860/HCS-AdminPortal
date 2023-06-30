import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Switch } from '@mui/material';
import { StyledToggleButtonLabel } from '../../../theme/styles/document-styles';

export default function ToggleButtons({
  customerAccessVal,
  handleChange,
  isActive,
  handleIsActiveChange,
}) {
  return (
    <Grid item lg={12} display="flex">
      <Grid display="flex">
        <StyledToggleButtonLabel variant="body2">Customer Access</StyledToggleButtonLabel>
        <Switch sx={{ mt: 1 }} checked={customerAccessVal} onChange={handleChange} />
      </Grid>
      <Grid display="flex">
        <StyledToggleButtonLabel variant="body2">Active</StyledToggleButtonLabel>
        <Switch sx={{ mt: 1 }} checked={isActive} onChange={handleIsActiveChange} />
      </Grid>
    </Grid>
  );
}

ToggleButtons.propTypes = {
  handleChange: PropTypes.func,
  handleIsActiveChange: PropTypes.func,
  customerAccessVal: PropTypes.bool,
  isActive: PropTypes.bool,
};
