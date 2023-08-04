import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Stack, Chip, Alert, Link } from '@mui/material';
import IconPopover from '../Icons/IconPopover';
import useResponsive from '../../../hooks/useResponsive';
import ViewFormMenuPopover from './ViewFormMenuPopover';
import Iconify from '../../../components/iconify';


export default function ViewFormField({
  heading,
  param,
  chipLabel,
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
  chipDialogArrayParam,
  customerVerifiedBy,
  machineVerifiedBy,
  customerAccess,
  documentIsActive,
  chips,
  userRolesChips,
  NewVersion,
  handleNewVersion,
  ViewAllVersions,
  handleAllVersion,
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
        </Typography>{NewVersion && <Link title='New Version' href="#" variant="subtitle1" underline='none' onClick={handleNewVersion} sx={{ fontWeight:"bold" }}> <Iconify heading="New Version" icon="icon-park-outline:add" sx={{mb:-0.8}}/></Link>}
        {ViewAllVersions && <Link title='View all Versions' onClick={handleAllVersion} href="#" underline="none"><Iconify icon="carbon:view" sx={{mb:-1, ml:1, width:"23px", height:"23px"}}/></Link>}
      

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
            <Grid container sx={{my:-2,
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              }} >
            {chipLabel ? 
            arrayParam.map(
              (data) =>
                data?.[chipLabel] &&
                typeof data?.[chipLabel] === 'string' &&
                data?.[chipLabel].trim().length > 0 && <Chip label={data?.[chipLabel]} sx={{m:0.2}} />
            ) : 
            arrayParam.map(
              (data) =>
                data?.name &&
                typeof data?.name === 'string' &&
                data?.name.trim().length > 0 && <Chip label={data?.name} sx={{m:0.2}} />
            )
            }
            </Grid>
        )}    
        
      {chipDialogArrayParam && typeof chipDialogArrayParam === 'object' && chipDialogArrayParam?.length > 0 &&
        <Grid container sx={{my:-2,
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              }} >
      {chipDialogArrayParam.map((item, index) => (
        <React.Fragment key={index}>
          {item}
          {index !== chipDialogArrayParam.length - 1}
        </React.Fragment>
      ))}
        </Grid>
      }

      {chips && typeof chips === 'object' && chips.length > 0 ? (
          <Grid container sx={{my:-2,
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              }} >
            {chips.map(
              (chip,index) => typeof chip === 'string' && chip.trim().length > 0 && <Chip key={index} label={chip} sx={{m:0.2}}/>
            )}
          </Grid>
        ) : (
          chips && typeof chips === 'string' && chips.trim().length > 0 && <Chip label={chips} />
        )}

        {userRolesChips && typeof userRolesChips === 'object' && userRolesChips?.length > 0 ? (
          <Grid container sx={{my:-2,
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              }} >
            {userRolesChips?.map((obj) => (obj?.roleType === 'SuperAdmin' ? <Chip label={obj?.name} sx={{mx:0.2}} color='secondary' /> : <Chip label={obj?.name} sx={{mx:0.3}} />))}
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
  chipLabel: PropTypes.string,
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
  chipDialogArrayParam: PropTypes.array,
  chips: PropTypes.array,
  userRolesChips: PropTypes.array,
  NewVersion: PropTypes.bool,
  handleNewVersion: PropTypes.func,
  ViewAllVersions: PropTypes.bool,
  handleAllVersion: PropTypes.func,
};
