import React, { useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Typography, Grid, Chip, createTheme, IconButton, TextField, Link } from '@mui/material';
import { green } from '@mui/material/colors';
import IconPopover from '../Icons/IconPopover';
import ViewFormMenuPopover from './ViewFormMenuPopover';
import SkeletonViewFormField from '../skeleton/SkeletonViewFormField';
import { StyledTooltip } from '../../theme/styles/default-styles';
import Iconify from '../iconify';
import { ICONS } from '../../constants/icons/default-icons';
import { fDateTime } from '../../utils/formatTime';

function ViewFormField({
  backLink,
  heading,
  headingIcon,
  headingIconTooltip,
  headingIconHandler,
  param,
  objectString,
  node,
  chipLabel,
  arrayParam,
  configArrayParam,
  toolType,
  secondParam,
  objectParam,
  secondObjectParam,
  numberParam,
  sm,
  isActive,
  isRequired,
  deleteDisabled,
  customerVerificationCount,
  machineVerificationCount,
  machineConnectionArrayChip,
  machineDocumentsArrayChip,
  verified,
  chipDialogArrayParam,
  customerVerifiedBy,
  machineVerifiedBy,
  customerAccess,
  documentIsActive,
  multiAuth,
  currentEmp,
  chips,
  customerContacts,
  userRolesChips,
  serviceParam,
  NewVersion,
  isNewVersion,
  handleNewVersion,
  handleUpdateVersion,
  ViewAllVersions,
  handleAllVersion,
  isLoading,
  variant='body1',
  srEvaluationComment,
}) {
  const [verifiedAnchorEl, setVerifiedAnchorEl] = useState(null);
  const [verifiedBy, setVerifiedBy] = useState([]);
  const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
  const theme = createTheme({
    palette: {
      success: green,
    },
  });

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
    <Grid item xs={12} sm={sm} sx={{ px: 0.5, py: 1, overflowWrap: 'break-word' }}>
      <Typography variant="overline" sx={{ color: 'text.disabled' }}>{heading || ''}</Typography>
      {headingIcon && (
        <StyledTooltip title={headingIconTooltip} placement="top" disableFocusListener tooltipcolor="#2065D1" color="#2065D1">
          {headingIconHandler ? (
            <Link onClick={headingIconHandler} color="inherit" sx={{ cursor: 'pointer', mx: 0.5 }}>
              {(headingIcon)}
            </Link>
          ) : headingIcon}
        </StyledTooltip>
      )}
      {isLoading ? (
          <SkeletonViewFormField />
      ) : (
      <>
        <Grid 
          style={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
          }}
        >
        <IconPopover isActive={isActive} />
        {backLink && <IconPopover backLink={backLink} />}
        {deleteDisabled !== undefined && <IconPopover deleteDisabled={deleteDisabled} />}
        {isRequired !== undefined && <IconPopover isRequired={isRequired} />}
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
        {multiAuth !== undefined && <IconPopover multiAuth={multiAuth} />}
        {currentEmp !== undefined && <IconPopover currentEmp={currentEmp} />}
        {customerAccess !== undefined && <IconPopover customerAccess={customerAccess} />}
        <Typography variant={variant}>
          {param && typeof param === 'string' && param.trim().length > 0 && param}
          {objectString && typeof objectString === 'string' && objectString.length > 0 && objectString}
          {param &&
            typeof param === 'string' &&
            param.trim().length > 0 &&
            secondParam &&
            typeof secondParam === 'string' &&
            secondParam.trim().length > 0 &&
            '  '}
          {param && typeof param !== 'string' && param}
          {secondParam &&
          typeof secondParam === 'string' &&
          secondParam.trim().length > 0 &&
          secondParam}
          {objectParam || ''}
          {secondObjectParam || ''}
          {numberParam || ''}
        </Typography>
        {srEvaluationComment && (
          <TextField
            disabled
            fullWidth
            value={ machineServiceRecord?.approval?.approvalLogs[0]?.comments || "" }
            variant="standard"
            helperText={`By ${machineServiceRecord?.approval?.approvalLogs[0]?.evaluatedBy.firstName} ${
                  machineServiceRecord?.approval?.approvalLogs[0]?.evaluatedBy.lastName
                } on ${fDateTime(machineServiceRecord?.approval?.approvalLogs[0]?.evaluationDate)}`}
            multiline
            minRows={1}
            // maxRows={6}
            size="small"
            FormHelperTextProps={{
              sx: {
                textAlign: 'right',
                marginLeft: 'auto',
                marginRight: "0",
              },
            }}
            InputProps={{
              sx: {
                typography: 'body2',
                '& .MuiInputBase-input.Mui-disabled': {
                  color: theme.palette.text.primary,
                  WebkitTextFillColor: theme.palette.text.primary,
                },
              },
            }}
            key={machineServiceRecord?.approval?.approvalLogs[0]?.comments}
          />
        )}
        {node || ''}
        {ViewAllVersions && 
          <StyledTooltip title={ICONS.VIEW_VERSIONS.heading} placement="top" disableFocusListener tooltipcolor={theme.palette.primary.main} color={theme.palette.primary.main}>
            <IconButton onClick={handleAllVersion} >
              <Iconify color={theme.palette.primary.main} sx={{ height: '20px', width: '20px' }} icon={ICONS.VIEW_VERSIONS.icon} />
            </IconButton>
          </StyledTooltip>
        }
        {NewVersion && handleNewVersion && 
          <StyledTooltip title={ICONS.ADD_NEW_VERSION.heading} placement="top" disableFocusListener tooltipcolor={theme.palette.primary.main} color={theme.palette.primary.main}>
            <IconButton onClick={handleNewVersion} >
              <Iconify color={theme.palette.primary.main} sx={{ height: '20px', width: '20px' }} icon={ICONS.ADD_NEW_VERSION.icon} />
            </IconButton>
          </StyledTooltip>
        }
        {handleUpdateVersion && 
          <StyledTooltip title={ICONS.UPDATE_VERSION.heading} placement="top" disableFocusListener tooltipcolor={theme.palette.primary.main} color={theme.palette.primary.main}>
            <IconButton onClick={handleUpdateVersion} >
              <Iconify color={theme.palette.primary.main} sx={{ height: '20px', width: '20px' }} icon={ICONS.UPDATE_VERSION.icon} />
            </IconButton>
          </StyledTooltip>
        }
        &nbsp;
      </Grid>
      {configArrayParam && typeof configArrayParam === 'object' && configArrayParam?.length > 0 && (
        <Grid container sx={{my:-3, mb:0,
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              }} >
              {configArrayParam.map(
                (data, index) =>
                  data?.docTitle &&
                  typeof data?.docTitle === 'string' &&
                  data?.docTitle.trim().length > 0 && <Chip key={index} sx={{m:0.2}} label={<div style={{display:'flex',alignItems:'center'}}  ><Typography variant='body2'>{`${data?.docTitle || ''}`}</Typography> <Typography variant='subtitle2'>{` - v${data?.docVersionNo}`}</Typography></div>} />
              )}
            </Grid>
      )}
      
      {arrayParam && typeof arrayParam === 'object' && arrayParam?.length > 0 && (
            <Grid container sx={{my:-3, mb:0,
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              }} >
            {chipLabel ?
            arrayParam.map(
              (data, index) =>
                data?.[chipLabel] &&
                typeof data?.[chipLabel] === 'string' &&
                data?.[chipLabel].trim().length > 0 && <Chip key={index} label={data?.[chipLabel].length > 50    ? `${data?.[chipLabel]?.substring(0, 50)}...`
                : data?.[chipLabel]} sx={{m:0.2}} />
            ) :
            arrayParam.map(
              (data, index) =>
                data?.name &&
                typeof data?.name === 'string' &&
                data?.name.trim().length > 0 && <Chip key={index} label={data?.name} sx={{m:0.2}} />
            )}
            </Grid>
        )}

            { machineConnectionArrayChip && Array.isArray(machineConnectionArrayChip) && machineConnectionArrayChip.length > 0 && (
              <Grid container sx={{
                  display: 'flex',  alignItems: 'center',  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',  mt:-1,  mb:1,
                  }} 
              >
                { machineConnectionArrayChip?.map(
                  (data, index) =>
                    data?.serialNo &&
                    typeof data?.serialNo === 'string' &&
                    data?.serialNo.trim().length > 0 && <Chip key={index} label={`${data?.serialNo || '' } ${data?.name ? '-' : '' } ${data?.name || '' }`} sx={{m:0.2}} />
                )}
              </Grid>
            )}

            { machineDocumentsArrayChip && Array.isArray(machineDocumentsArrayChip) && machineDocumentsArrayChip.length > 0 && (
              <Grid container sx={{
                  display: 'flex',  alignItems: 'center',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word', mt:-1, mb:1,
                  }} 
              >
                { machineDocumentsArrayChip?.map(
                  (data, index) =>
                    data?.displayName &&
                    typeof data?.displayName === 'string' &&
                    data?.displayName.trim().length > 0 && <Chip key={index} label={`${data?.displayName || '' }`} sx={{m:0.2}} />
                )}
              </Grid>
            )}

            {toolType && typeof toolType === 'object' && toolType?.length > 0 && (
                <Grid container sx={{my:-3, mb:0,
                  display: 'flex',  alignItems: 'center',
                  whiteSpace: 'pre-line',  wordBreak: 'break-word',
                  }} 
                >
                    {toolType.map((type, index) => (
                      type?.tool?.name &&
                      typeof type.tool.name === 'string' &&
                      type?.tool?.name.trim().length > 0 && (
                      <Chip key={index} label={type.tool.name} sx={{ m: 0.2 }} />
                      )))
                    }
                </Grid>
            )}

            {chipDialogArrayParam && typeof chipDialogArrayParam === 'object' && chipDialogArrayParam?.length > 0 &&
              <Grid container sx={{my:-3, mb:0,
                    display: 'flex',  alignItems: 'center',
                    whiteSpace: 'pre-line',  wordBreak: 'break-word',
                    }} 
              >
                  {chipDialogArrayParam.map((item, index) => (
                    <React.Fragment key={index}>
                      {item}
                      {index !== chipDialogArrayParam.length - 1}
                    </React.Fragment>)
                  )}
              </Grid>
            }

            {chips && typeof chips === 'object' && chips.length > 0 ? (
              <Grid container sx={{my:-3, mb:0,
                  display: 'flex',  alignItems: 'center',
                  whiteSpace: 'pre-line', wordBreak: 'break-word',
                  }} >
                {chips.map(
                  (chip,index) => typeof chip === 'string' && chip.trim().length > 0 && <Chip key={index} title={chip} label={chip} sx={{m:0.2}}/>
                )}
              </Grid>
              ) : (
              chips && typeof chips === 'string' && chips.trim().length > 0 && <Chip label={chips} sx={{m:0.2}} />
            )}

            {customerContacts && typeof customerContacts === 'object' && customerContacts.length > 0 ? (
              <Grid container sx={{my:-3, mb:0,
                  display: 'flex',  alignItems: 'center',
                  whiteSpace: 'pre-line',  wordBreak: 'break-word',
                  }} >
                {customerContacts.map(
                  (chip,index) =>  <Chip key={index} label={`${chip?.firstName || '' } ${chip?.lastName || '' }`} sx={{m:0.2}}/>
                )}
              </Grid>
              ) : (
              customerContacts && typeof customerContacts?.firstName === 'string' && <Chip label={`${customerContacts?.firstName || '' } ${customerContacts?.lastName || '' }`} sx={{m:0.2}} />
            )}

            {userRolesChips && typeof userRolesChips === 'object' && userRolesChips?.length > 0 ? (
              <Grid container sx={{my:-3, mb:0,
                  display: 'flex',
                  }} >
                {userRolesChips?.map((obj, index) => (obj?.roleType === 'SuperAdmin' ? <Chip key={index} label={obj?.name} sx={{m:0.2}} color='secondary' /> : <Chip key={index} label={obj?.name} sx={{mx:0.2}} />))}
              </Grid>
              ) : (
              userRolesChips && typeof userRolesChips === 'string' && userRolesChips.trim().length > 0 && <Chip label={userRolesChips} sx={{m:0.2}} />
            )}

            {serviceParam && typeof serviceParam === 'object' && serviceParam?.length > 0 ? (
                  <Grid container sx={{my:-3, mb:0, 
                      display: 'flex', alignItems: 'center', 
                      whiteSpace: 'pre-line', wordBreak: 'break-word',
                      }} 
                  >
                    {serviceParam?.map((obj, index) => ( <Chip key={index} label={obj?.name} sx={{m:0.2}} />))}
                  </Grid>
                  ) : (
                  serviceParam && typeof serviceParam === 'string' && serviceParam.trim().length > 0 && <Chip label={serviceParam} sx={{m:0.2}} />
            )}
        </>
      )}

      
      <ViewFormMenuPopover
        open={verifiedAnchorEl}
        onClose={handleVerifiedPopoverClose}
        ListArr={verifiedBy}
        ListTitle="Verified By"
      />
    </Grid>
  );
}
export default memo(ViewFormField)
ViewFormField.propTypes = {
  heading: PropTypes.string,
  headingIcon: PropTypes.object,
  headingIconTooltip: PropTypes.string,
  headingIconHandler: PropTypes.func,
  node: PropTypes.node,
  param: PropTypes.string,
  objectString: PropTypes.string,
  arrayParam: PropTypes.array,
  configArrayParam: PropTypes.array,
  toolType: PropTypes.array,
  chipLabel: PropTypes.string,
  numberParam: PropTypes.number,
  secondParam: PropTypes.string,
  objectParam: PropTypes.object,
  secondObjectParam: PropTypes.object,
  sm: PropTypes.number,
  isActive: PropTypes.bool,
  isRequired: PropTypes.bool,
  deleteDisabled: PropTypes.bool,
  customerVerificationCount: PropTypes.number,
  machineVerificationCount: PropTypes.number,
  machineConnectionArrayChip: PropTypes.array,
  machineDocumentsArrayChip: PropTypes.array,
  verified: PropTypes.bool,
  machineVerifiedBy: PropTypes.array,
  customerVerifiedBy: PropTypes.array,
  customerAccess: PropTypes.bool,
  documentIsActive: PropTypes.bool,
  multiAuth: PropTypes.bool,
  currentEmp: PropTypes.bool,
  chipDialogArrayParam: PropTypes.array,
  chips: PropTypes.any,
  customerContacts: PropTypes.array,
  userRolesChips: PropTypes.array,
  serviceParam: PropTypes.array,
  NewVersion: PropTypes.bool,
  isNewVersion: PropTypes.bool,
  handleNewVersion: PropTypes.func,
  handleUpdateVersion: PropTypes.func,
  ViewAllVersions: PropTypes.bool,
  handleAllVersion: PropTypes.func,
  backLink: PropTypes.func,
  isLoading: PropTypes.bool,
  variant: PropTypes.string,
  srEvaluationComment: PropTypes.bool
};

