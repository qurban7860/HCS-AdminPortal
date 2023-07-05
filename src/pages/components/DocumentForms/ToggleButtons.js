import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Switch } from '@mui/material';
import { StyledToggleButtonLabel } from '../../../theme/styles/document-styles';
import RHFSwitch from '../../../components/hook-form/RHFSwitch';

export default function ToggleButtons({
  customerAccessVal,
  handleChange,
  isActive,
  handleIsActiveChange,
  isDocument,
  isMachine,
  name,
}) {
  return (
    <Grid item lg={12} display="flex">
      {isDocument && (
        <Grid display="flex">
          <StyledToggleButtonLabel variant="body2">Customer Access</StyledToggleButtonLabel>
          <Switch sx={{ mt: 1 }} checked={customerAccessVal} onChange={handleChange} />
        </Grid>
      )}
      {!isMachine && (
        <Grid display="flex">
          <StyledToggleButtonLabel variant="body2">Active</StyledToggleButtonLabel>
          <Switch sx={{ mt: 1 }} checked={isActive} onChange={handleIsActiveChange} />
        </Grid>
      )}
      {isMachine && (
        <Grid display="flex">
          <StyledToggleButtonLabel variant="body2">Active</StyledToggleButtonLabel>
          <RHFSwitch sx={{ mt: 1 }} name={name} />
        </Grid>
      )}
    </Grid>
  );
}

ToggleButtons.propTypes = {
  handleChange: PropTypes.func,
  handleIsActiveChange: PropTypes.func,
  customerAccessVal: PropTypes.bool,
  isActive: PropTypes.bool,
  isDocument: PropTypes.bool,
  isMachine: PropTypes.bool,
  name: PropTypes.string,
};
