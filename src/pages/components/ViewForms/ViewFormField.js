import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Typography, Grid, Stack, Chip, Alert } from '@mui/material';
import IconPopover from '../Icons/IconPopover';
import useResponsive from '../../../hooks/useResponsive';
import ViewFormMenuPopover from './ViewFormMenuPopover';

export default function ViewFormField({
  heading,
  param,
  arrayParam,
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
  chips,
  userRolesChips,
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
        {param && typeof param === 'string' && param.trim().length > 0 && param}
        {param &&
          typeof param === 'string' &&
          param.trim().length > 0 &&
          secondParam &&
          typeof secondParam === 'string' &&
          secondParam.trim().length > 0 &&
          '  '}
        {secondParam &&
          typeof secondParam === 'string' &&
          secondParam.trim().length > 0 &&
          secondParam}
        {objectParam || ''}
        {secondObjectParam || ''}
        {numberParam || ''}
        &nbsp;

      </Typography>

      {arrayParam && typeof arrayParam === 'object' && arrayParam?.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ my: 2 }}>
          <Typography
            variant="body1"
            style={{
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
            }}
          >
            {arrayParam.map(
              (data) =>
                data?.name &&
                typeof data?.name === 'string' &&
                data?.name.trim().length > 0 && <Chip label={data?.name} />
            )}
            </Typography>
          </Stack>
        )}        
        {arrayParam && typeof arrayParam === 'object' && arrayParam?.length > 0 && (
          <Grid item sx={{display: 'flex-inline'}} >
            <Grid container justifyContent="flex-start" spacing={1}>
              {arrayParam.map(
              (data) =>
                data?.name &&
                typeof data?.name === 'string' &&
                data?.name.trim().length > 0 && <Chip label={data?.name} sx={{m:0.2}} />
            )}
            </Grid>
          </Grid>
        )}

      {chips && typeof chips === 'object' ? (
        <Grid item sx={{display: 'flex-inline'}} >
          <Grid container justifyContent="flex-start" spacing={1}>
            {chips.map(
              (chip) => typeof chip === 'string' && chip.trim().length > 0 && <Chip label={chip} sx={{m:0.2}}/>
            )}
          </Grid>
        </Grid>
        ) : (
          chips && typeof chips === 'string' && chips.trim().length > 0 && <Chip label={chips} />
        )}

        {userRolesChips && typeof userRolesChips === 'object' ? (
          <Grid item sx={{display: 'flex-inline'}} >
          <Grid container justifyContent="flex-start" spacing={1}>
            {userRolesChips.map((obj) => (obj.roleType === 'SuperAdmin' ? <Chip label={obj.name} sx={{mx:0.2}} color='secondary' /> : <Chip label={obj.name} sx={{mx:0.3}} />))}
          </Grid>
          </Grid>
        ) : (
          userRolesChips && typeof userRolesChips === 'string' && userRolesChips.trim().length > 0 && <Chip label={userRolesChips} />
        )}

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
  arrayParam: PropTypes.array,
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
  chips: PropTypes.array,
  userRolesChips: PropTypes.array,
};
