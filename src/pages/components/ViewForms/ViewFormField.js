import React, { useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid, Chip, createTheme, IconButton } from '@mui/material';
import { green } from '@mui/material/colors';
import IconPopover from '../Icons/IconPopover';
import ViewFormMenuPopover from './ViewFormMenuPopover';
import SkeletonViewFormField from '../../../components/skeleton/SkeletonViewFormField';
import IconTooltip from '../Icons/IconTooltip';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import Iconify from '../../../components/iconify';
import { ICONS } from '../../../constants/icons/default-icons';

function ViewFormField({
  backLink,
  heading,
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
  variant
}) {
  const [verifiedAnchorEl, setVerifiedAnchorEl] = useState(null);
  const [verifiedBy, setVerifiedBy] = useState([]);

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
      {isLoading ? (
          <SkeletonViewFormField />
      ) : (
      <>
        <Typography variant={variant}
          style={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
            color:heading?.toLowerCase()==="status" && param?.toLowerCase()==="transferred" && 'red'
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
        {node || ''}
        {objectParam || ''}
        {secondObjectParam || ''}
        {numberParam || ''}
        {ViewAllVersions && 
          <StyledTooltip title={ICONS.VIEW_VERSIONS.heading} placement="top" disableFocusListener tooltipcolor={theme.palette.primary.main} color={theme.palette.primary.main}>
            <IconButton size='small' onClick={handleAllVersion} >
              <Iconify color={theme.palette.primary.main} icon={ICONS.VIEW_VERSIONS.icon} />
            </IconButton>
          </StyledTooltip>
        }
        {NewVersion && 
          <StyledTooltip title={ICONS.ADD_NEW_VERSION.heading} placement="top" disableFocusListener tooltipcolor={theme.palette.primary.main} color={theme.palette.primary.main}>
            <IconButton size='small' onClick={handleNewVersion} >
              <Iconify color={theme.palette.primary.main} icon={ICONS.ADD_NEW_VERSION.icon} />
            </IconButton>
          </StyledTooltip>
        }
        {handleUpdateVersion && 
          <StyledTooltip title={ICONS.UPDATE_VERSION.heading} placement="top" disableFocusListener tooltipcolor={theme.palette.primary.main} color={theme.palette.primary.main}>
            <IconButton size='small' onClick={handleUpdateVersion} >
              <Iconify color={theme.palette.primary.main} icon={ICONS.UPDATE_VERSION.icon} />
            </IconButton>
          </StyledTooltip>
        }
        &nbsp;

      </Typography>
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
                  data?.docTitle.trim().length > 0 && <Chip key={index} sx={{m:0.2}} label={<div style={{display:'flex',alignItems:'center'}}  ><Typography variant='body2'>{`${data?.docTitle || ''}`}</Typography> <Typography variant='subtitle2'>{` - v${data?.docVersionNo}`}</Typography></div>} sx={{m:0.2}} />
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
            )
            }
            </Grid>
        )}

        {toolType && typeof toolType === 'object' && toolType?.length > 0 && (
            <Grid container sx={{my:-3, mb:0,
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              }} >
              {toolType.map((type, index) => (
              type?.tool?.name &&
              typeof type.tool.name === 'string' &&
              type?.tool?.name.trim().length > 0 && (
              <Chip key={index} label={type.tool.name} sx={{ m: 0.2 }} />
              )
            ))}
            </Grid>
        )}

      {chipDialogArrayParam && typeof chipDialogArrayParam === 'object' && chipDialogArrayParam?.length > 0 &&
        <Grid container sx={{my:-3, mb:0,
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
          <Grid container sx={{my:-3, mb:0,
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
          chips && typeof chips === 'string' && chips.trim().length > 0 && <Chip label={chips} sx={{m:0.2}} />
        )}

        {customerContacts && typeof customerContacts === 'object' && customerContacts.length > 0 ? (
          <Grid container sx={{my:-3, mb:0,
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              }} >
            {customerContacts.map(
              (chip,index) =>  <Chip key={index} label={`${chip?.firstName || ''} ${chip?.lastName || ''}`} sx={{m:0.2}}/>
            )}
          </Grid>
        ) : (
          customerContacts && typeof customerContacts === 'string' && customerContacts.trim().length > 0 && <Chip label={`${customerContacts?.firstName || ''} ${customerContacts?.lastName || ''}`} sx={{m:0.2}} />
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
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              }} >
            {serviceParam?.map((obj, index) => ( <Chip key={index} label={obj?.name} sx={{m:0.2}} />))}
          </Grid>
        ) : (
          serviceParam && typeof serviceParam === 'string' && serviceParam.trim().length > 0 && <Chip label={serviceParam} sx={{m:0.2}} />
        )}
          </>
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
export default memo(ViewFormField)
ViewFormField.propTypes = {
  heading: PropTypes.string,
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
};

ViewFormField.defaultProps = {
  variant: 'body1',
};
