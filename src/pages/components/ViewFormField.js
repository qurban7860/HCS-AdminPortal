import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Typography, Grid } from '@mui/material';
import IconPopover from './IconPopover';
import useResponsive from '../../hooks/useResponsive';
import ViewFormMenuPopover from './ViewFormMenuPopover';

export default function ViewFormField({
  heading,
  param,
  secondParam,
  objectParam,
  secondObjectParam,
  numberParam,
  sm,
  isActive,
  deleteDisabled,
  customerVerificationCount,
  machineVerificationCount,
  verified,
  customerVerifiedBy,
  machineVerifiedBy,
  customerAccess,
  documentIsActive,
}) {
  const [verifiedAnchorEl, setVerifiedAnchorEl] = useState(null);
  const [verifiedBy, setVerifiedBy] = useState([]);
  const { isMobile } = useResponsive();

  useEffect(() => {
    if (customerVerifiedBy) {
      setVerifiedBy(customerVerifiedBy);
    } else if (machineVerifiedBy) {
      setVerifiedBy(machineVerifiedBy);
    }
  }, [customerVerifiedBy, machineVerifiedBy]);

  const handleVerifiedPopoverOpen = (event) => {
    setVerifiedAnchorEl(event.currentTarget);
  };

  const handleVerifiedPopoverClose = () => {
    setVerifiedAnchorEl(null);
  };

  return (
    <Grid item xs={12} sm={sm} sx={{ px: 2, py: 1, overflowWrap: 'break-word' }}>
      <Typography variant="overline" sx={{ color: 'text.disabled' }}>
        {heading || ''}
      </Typography>
      <Typography
        variant={
          heading === 'Serial No' ||
          heading === 'Machine Model' ||
          heading === 'Customer' ||
          heading === 'Machine'
            ? 'h4'
            : 'body1'
        }
        style={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'pre-line',
          wordBreak: 'break-word',
        }}
      >
        <IconPopover isActive={isActive} />
        {deleteDisabled !== undefined && <IconPopover deleteDisabled={deleteDisabled} />}
        {(customerVerificationCount || machineVerificationCount > 0) && verified > 0 && (
          <IconPopover
            customerVerificationCount={customerVerificationCount}
            machineVerificationCount={machineVerificationCount}
            verified={verified}
            verifyBadgeClick={handleVerifiedPopoverOpen}
          />
        )}
        {/* input fields params */}
        {documentIsActive !== undefined && <IconPopover documentIsActive={documentIsActive} />}
        {customerAccess !== undefined && <IconPopover customerAccess={customerAccess} />}
        {param && param.trim().length > 0 && param}
        {param && param.trim().length > 0 && secondParam && secondParam.trim().length > 0 && '  '}
        {secondParam && secondParam.trim().length > 0 && secondParam}
        {objectParam || ''}
        {secondObjectParam || ''}
        {numberParam || ''}
        &nbsp;
      </Typography>
      {/* popover for verification list */}
      <ViewFormMenuPopover
        open={verifiedAnchorEl}
        onClose={handleVerifiedPopoverClose}
        ListArr={verifiedBy}
        ListTitle="Verified By"
      />
    </Grid>
  );
}

ViewFormField.propTypes = {
  heading: PropTypes.string,
  param: PropTypes.string,
  numberParam: PropTypes.number,
  secondParam: PropTypes.string,
  objectParam: PropTypes.object,
  secondObjectParam: PropTypes.object,
  sm: PropTypes.number,
  isActive: PropTypes.bool,
  deleteDisabled: PropTypes.bool,
  customerVerificationCount: PropTypes.number,
  machineVerificationCount: PropTypes.number,
  verified: PropTypes.bool,
  machineVerifiedBy: PropTypes.array,
  customerVerifiedBy: PropTypes.array,
  customerAccess: PropTypes.bool,
  documentIsActive: PropTypes.bool,
};
