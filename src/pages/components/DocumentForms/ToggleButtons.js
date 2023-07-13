import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Switch } from '@mui/material';
import { StyledToggleButtonLabel } from '../../../theme/styles/document-styles';
import RHFSwitch from '../../../components/hook-form/RHFSwitch';
import { TOGGLE } from '../../../constants/default-constants';

ToggleButtons.propTypes = {
  handleChange: PropTypes.func,
  handleIsActiveChange: PropTypes.func,
  customerAccessVal: PropTypes.bool,
  isActive: PropTypes.bool,
  isDocument: PropTypes.bool,
  isMachine: PropTypes.bool,
  isRHF: PropTypes.bool,
  name: PropTypes.object,
  RHFName: PropTypes.string,
  isCONNECTABLE: PropTypes.bool,
  CONNECTName: PropTypes.string,
};

export default function ToggleButtons({
  customerAccessVal,
  handleChange,
  isActive,
  handleIsActiveChange,
  isDocument,
  isMachine,
  name,
  isRHF,
  RHFName,
  isCONNECTABLE,
  CONNECTName,
}) {
  return (
    <Grid item lg={12} display="flex">
      {!isMachine && (
        <Grid display="flex" alignItems="center" mt={1}>
          <StyledToggleButtonLabel variant="body2" p={1}>
            {TOGGLE.ACTIVE}
          </StyledToggleButtonLabel>
          <Switch checked={isActive} onChange={handleIsActiveChange} />
        </Grid>
      )}
      {isMachine && (
        <Grid display="flex" alignItems="center" mt={1}>
          <StyledToggleButtonLabel variant="body2" p={1}>
            {TOGGLE.ACTIVE}
          </StyledToggleButtonLabel>
          <RHFSwitch name={name} />
        </Grid>
      )}
      {isDocument && (
        <Grid display="flex" alignItems="center" mt={1}>
          <StyledToggleButtonLabel variant="body2" p={1}>
            {TOGGLE.CUSTOMER_ACCESS}
          </StyledToggleButtonLabel>
          <Switch checked={customerAccessVal} onChange={handleChange} />
        </Grid>
      )}
      {isRHF && (
        <Grid display="flex" alignItems="center" mt={1}>
          <StyledToggleButtonLabel variant="body2" p={1}>
            {TOGGLE.CUSTOMER_ACCESS}
          </StyledToggleButtonLabel>
          <RHFSwitch name={RHFName} />
        </Grid>
      )}
      {isCONNECTABLE && (
        <Grid display="flex" alignItems="center" mt={1}>
          <StyledToggleButtonLabel variant="body2" p={1}>
            {TOGGLE.CONNECTABLE}
          </StyledToggleButtonLabel>
          <RHFSwitch name={CONNECTName} />
        </Grid>
      )}
    </Grid>
  );
}
