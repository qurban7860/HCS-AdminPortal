import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { Badge, Box, Divider, Grid, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { memo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { green } from '@mui/material/colors';
import { DateTimePicker } from '@mui/x-date-pickers';
import { createTheme } from '@mui/material/styles';

import { StyledStack } from '../../theme/styles/default-styles';
import ConfirmDialog from '../confirm-dialog';
import useResponsive from '../../hooks/useResponsive';
import { setTransferDialogBoxVisibility } from '../../redux/slices/products/machine';
import { getActiveMachineStatuses } from '../../redux/slices/products/statuses';
import { getActiveCustomers } from '../../redux/slices/customer/customer';
import IconPopover from '../Icons/IconPopover';
import IconTooltip from '../Icons/IconTooltip';
import ViewFormMenuPopover from './ViewFormMenuPopover';
import ViewFormApprovalsPopover from './ViewFormApprovalsPopover';
import { ICONS } from '../../constants/icons/default-icons';
import { fDate, fDateTime } from '../../utils/formatTime';
import { useAuthContext } from '../../auth/useAuthContext';

function ViewFormEditDeleteButtons({
  // Icons 
  backLink,
  isActive,
  isDefault,
  isDeleteDisabled,
  customerAccess,
  isRequired,
  multiAuth,
  currentEmp,
  machineSettingPage,
  settingPage,
  securityUserPage,
  // Handlers
  handleVerification,
  handleVerificationTitle,
  onDelete,
  handleEdit,
  handleTransfer,
  handleUpdatePassword,
  handleUserInvite,
  handleSendPDFEmail,
  handleViewPDF,
  isSubmitted,
  returnToSubmitted,
  approvers,
  isVerifiedTitle,
  isInviteLoading,
  type,
  sites,
  mainSite,
  handleMap,
  moveCustomerContact,
  approveConfig,
  approveHandler,
  copyConfiguration,
  onUserStatusChange,
  financingCompany,

  // DISABLE
  disableTransferButton = false,
  disableDeleteButton = false,
  disablePasswordButton = false,
  disableEditButton = false,
  isLoading,

  // ICONS & HANDLERS
  verifiers,
  userStatus,
  supportSubscription,
  machineSupportDate,
  approveConfiglength,
  excludeReports,
  isConectable,
  hanldeViewGallery

}) {
  const { id } = useParams();
  const userId = localStorage.getItem('userId');

  const { isDisableDelete, isSettingReadOnly, isSecurityReadOnly } = useAuthContext();
  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openUserInviteConfirm, setOpenUserInviteConfirm] = useState(false);
  const [openVerificationConfirm, setOpenVerificationConfirm] = useState(false);
  const [openUserStatuConfirm, setOpenUserStatuConfirm] = useState(false);
  const [openConfigDraftStatuConfirm, setOpenConfigDraftStatuConfirm] = useState(false);
  const [openConfigSubmittedStatuConfirm, setOpenConfigSubmittedStatuConfirm] = useState(false);
  const [openConfigApproveStatuConfirm, setOpenConfigApproveStatuConfirm] = useState(false);
  const [lockUntil, setLockUntil] = useState(''); 
  const [lockUntilError, setLockUntilError] = useState(''); 

  const theme = createTheme({
    palette: {
      success: green,
    },
  });
  


  // Function to handle date change
  const handleLockUntilChange = newValue => {
    const selectedDate = new Date(newValue);
    if (selectedDate) {
      // Check if the selected date is in the future (optional)
      const currentDate = new Date();
      if (selectedDate < currentDate) {
        setLockUntilError('Please select a future date and time.');
      } else {
        setLockUntil(newValue);
        setLockUntilError(''); // Clear the error when a valid date is selected
      }
    } else {
      setLockUntilError('Invalid date and time'); // Set an error message for an invalid date and time
    }
  };

   // Function to handle date change
   const handleChangeUserStatus = () => {
    if (!lockUntil && !userStatus?.locked) {
      setLockUntilError('Lock Until is required');
    }else{

      if(lockUntil){
        const timeDifference = new Date(lockUntil) - new Date();
        const minutesDifference = timeDifference / (1000 * 60);
        onUserStatusChange(minutesDifference);
      }else{
        onUserStatusChange(0);
      }
      setOpenUserStatuConfirm(false);
    }
    setLockUntil('');
  };


  const handleOpenConfirm = (dialogType) => {

    if (dialogType === 'UserInvite') {
      setOpenUserInviteConfirm(true);
    }

    if (dialogType === 'Verification') {
      setOpenVerificationConfirm(true);
    }

    if (dialogType === 'delete' && ( !isDisableDelete || !disableDeleteButton ) ) {
      setOpenConfirm(true);
    }

    if (dialogType === 'transfer') {
      dispatch(getActiveCustomers());
      dispatch(getActiveMachineStatuses());
      dispatch(setTransferDialogBoxVisibility(true));
    }

    if (dialogType === 'UserStatus') {
      setOpenUserStatuConfirm(true);
    }

    if (dialogType === 'ChangeConfigStatusToDraft') {
      setOpenConfigDraftStatuConfirm(true);
    }

    if (dialogType === 'ChangeConfigStatusToSubmitted') {
      setOpenConfigSubmittedStatuConfirm(true);
    }

    if (dialogType === 'ChangeConfigStatusToApprove') {
      setOpenConfigApproveStatuConfirm(true);
    }
    
  };

  const handleCloseConfirm = (dialogType) => {

    if (dialogType === 'UserInvite') {
      setOpenUserInviteConfirm(false);
    }

    if (dialogType === 'Verification') {
      reset();
      setOpenVerificationConfirm(false);
    }
    if (dialogType === 'delete') {
      reset();
      setOpenConfirm(false);
    }
    if (dialogType === 'transfer') {
      dispatch(setTransferDialogBoxVisibility(false));
    }

    if (dialogType === 'UserStatus') {
      setOpenUserStatuConfirm(false);
      setLockUntilError('');
    }

    if (dialogType === 'ChangeConfigStatusToDraft') {
      setOpenConfigDraftStatuConfirm(false);
    }

    if (dialogType === 'ChangeConfigStatusToSubmitted') {
      setOpenConfigSubmittedStatuConfirm(false);
    }

    if (dialogType === 'ChangeConfigStatusToApprove') {
      setOpenConfigApproveStatuConfirm(false);
    }
    
  };

  const handleVerificationConfirm = () => {
    handleVerification();
    handleCloseConfirm('Verification');
  };
  
  const [verifiedAnchorEl, setVerifiedAnchorEl] = useState(null);
  const [verifiedBy, setVerifiedBy] = useState([]);

  const [approvedAnchorEl, setApprovedAnchorEl] = useState(null);
  const [approvedBy, setApprovedBy] = useState([]);

  const handleVerifiedPopoverOpen = (event) => {
    setVerifiedAnchorEl(event.currentTarget);
    setVerifiedBy(verifiers)
  };

  const handleVerifiedPopoverClose = () => {
    setVerifiedAnchorEl(null);
    setVerifiedBy([])
  };

  const handleApprovedPopoverOpen = (event) => {
    setApprovedAnchorEl(event.currentTarget);
    setApprovedBy(approvers)
  };

  const handleApprovedPopoverClose = () => {
    setApprovedAnchorEl(null);
    setApprovedBy([])
  };

  const { isMobile } = useResponsive('down', 'sm');
  const methods = useForm();

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = methods;

  const machineSupport = {
    status:new Date(machineSupportDate).getTime() > new Date().getTime(),
    date: new Date(machineSupportDate)
  }

  return (
    <Grid container justifyContent="space-between" sx={{pb:1, px:0.5}}>
      <Grid item sx={{display:'flex', mt:0.5,mr:1}}>
        <StyledStack>
          {backLink &&
            <>
              <IconTooltip
                title='Back'
                onClick={() => backLink()
                }
                color={theme.palette.primary.main}
                icon="mdi:arrow-left"
              />
              {/* <Divider */}
              <Divider orientation="vertical" flexItem />
            </>
          }

          {isActive!==undefined &&
            <IconTooltip
              title={isActive?ICONS.ACTIVE.heading:ICONS.INACTIVE.heading}
              color={isActive?ICONS.ACTIVE.color:ICONS.INACTIVE.color}
              icon={isActive?ICONS.ACTIVE.icon:ICONS.INACTIVE.icon}
            />
          }

          {isDeleteDisabled !==undefined &&
            <IconTooltip
              title= { isDeleteDisabled ? ICONS.DELETE_ENABLED.heading:ICONS.DELETE_DISABLED.heading}
              color= { isDeleteDisabled ? ICONS.DELETE_ENABLED.color:ICONS.DELETE_DISABLED.color}
              icon=  { isDeleteDisabled ? ICONS.DELETE_ENABLED.icon:ICONS.DELETE_DISABLED.icon}
            />
          }
          
          {isDefault !==undefined &&
            <IconTooltip
              title={isDefault?ICONS.DEFAULT.heading:ICONS.CONTRAST.heading}
              color={isDefault?ICONS.DEFAULT.color:ICONS.CONTRAST.color}
              icon= {isDefault?ICONS.DEFAULT.icon:ICONS.CONTRAST.icon}
            />}
          
          {supportSubscription!==undefined &&
            <IconTooltip
            title={supportSubscription?`Support Subscription Enabled`:`Support Subscription Disabled`}
            color={supportSubscription?ICONS.ALLOWED.color:ICONS.DISALLOWED.color}
            icon="bx:support"
            />
          }

          {financingCompany!==undefined &&
            <IconTooltip
            title={financingCompany ? `Financing Company Enabled`:`Financing Company Disabled`}
            color={financingCompany ? ICONS.ALLOWED.color : ICONS.DISALLOWED.color}
            icon="vaadin:office"
            />
          }

          {excludeReports &&
            <IconTooltip title={ICONS.EXCLUDE_REPORTING.heading} color={ICONS.EXCLUDE_REPORTING.color} 
            icon={ICONS.EXCLUDE_REPORTING.icon} />
          }

          {machineSupportDate &&
            <IconTooltip
              title={machineSupport?.status?`Support valid till ${fDate(machineSupportDate)}`:`Support ended ${fDate(machineSupportDate)}`}
              color={machineSupport?.status?ICONS.ALLOWED.color:ICONS.DISALLOWED.color}
              icon="bx:support"
              />
          }

          {verifiers?.length>0 &&
          <Badge badgeContent={verifiers.length} color="info">
            <IconTooltip
              title={isVerifiedTitle || 'Verified'}
              color={ICONS.ALLOWED.color}
              icon="ic:outline-verified-user"
              onClick={handleVerifiedPopoverOpen}
              />
          </Badge>
          }

          {approveConfiglength !== undefined &&
            <Badge badgeContent={approveConfiglength} color="info">
              <IconTooltip
                title={approveConfig?ICONS.APPROVED.heading:ICONS.NOTAPPROVED.heading}
                color={approveConfig?ICONS.APPROVED.color:ICONS.NOTAPPROVED.color}
                icon={approveConfig?ICONS.APPROVED.icon:ICONS.NOTAPPROVED.icon}
                onClick={handleApprovedPopoverOpen}
              />
            </Badge>
          }


          {customerAccess !== undefined &&
            <IconTooltip
              title={customerAccess ? ICONS.ALLOWED.heading : ICONS.DISALLOWED.heading}
              color={customerAccess ? ICONS.ALLOWED.color : ICONS.DISALLOWED.color}
              icon={customerAccess ? ICONS.ALLOWED.icon : ICONS.DISALLOWED.icon}
            />
          }

          {isRequired !== undefined &&
            <IconTooltip
              title={isRequired ? ICONS.REQUIRED.heading : ICONS.NOTREQUIRED.heading}
              color={isRequired ? ICONS.REQUIRED.color : ICONS.NOTREQUIRED.color}
              icon={isRequired ? ICONS.REQUIRED.icon : ICONS.NOTREQUIRED.icon}
            />
          }

          {multiAuth !== undefined &&
            <IconTooltip
              title={multiAuth ? ICONS.MULTIAUTH_ACTIVE.heading : ICONS.MULTIAUTH_INACTIVE.heading}
              color={multiAuth ? ICONS.MULTIAUTH_ACTIVE.color : ICONS.MULTIAUTH_INACTIVE.color}
              icon={multiAuth ? ICONS.MULTIAUTH_ACTIVE.icon : ICONS.MULTIAUTH_INACTIVE.icon}
            />
          }

          {currentEmp !== undefined &&
            <IconTooltip
              title={currentEmp ? ICONS.CURR_EMP_ACTIVE.heading : ICONS.CURR_EMP_INACTIVE.heading}
              color={currentEmp ? ICONS.CURR_EMP_ACTIVE.color : ICONS.CURR_EMP_INACTIVE.color}
              icon={currentEmp ? ICONS.CURR_EMP_ACTIVE.icon : ICONS.CURR_EMP_INACTIVE.icon}
            />
          }

          {userStatus &&
          <IconTooltip
            title={userStatus?.locked?`User locked by ${userStatus?.lockedBy} until ${fDateTime(userStatus?.lockedUntil)}`:"User Unlocked"}
            color={userStatus?.locked?ICONS.USER_LOCK.color:ICONS.USER_UNLOCK.color}
            icon={userStatus?.locked?ICONS.USER_LOCK.icon:ICONS.USER_UNLOCK.icon}
          />
          }

          {isConectable !==undefined &&
          <IconTooltip
            title={isConectable?'Connectable As Child':"Not Connectable As Child"}
            color={isConectable?ICONS.ALLOWED.color : ICONS.DISALLOWED.color}
            icon={isConectable?'material-symbols:cast-connected-rounded':"material-symbols:cast-connected-rounded"}
          />
          }



        </StyledStack>
      </Grid>

      <Grid item  sx={{ ml:'auto', mt:0.5}}>
        <StyledStack>
          {handleVerification && !(verifiers && verifiers.length > 0 && verifiers?.some((verified) => verified?.verifiedBy?._id === userId)) && (
          <IconTooltip
            title={handleVerificationTitle || 'Verify'}
            onClick={() => handleOpenConfirm('Verification')}
            color={theme.palette.primary.main}
            icon="ic:outline-verified-user"
          />
          )}

          {/* User Status Change */}
          {onUserStatusChange && !isSecurityReadOnly && id!==userId &&(
            <IconTooltip
            title={userStatus?.locked?ICONS.USER_UNLOCK.heading:ICONS.USER_LOCK.heading}
            color={userStatus?.locked?ICONS.USER_UNLOCK.color:ICONS.USER_LOCK.color}
            icon={userStatus?.locked?ICONS.USER_UNLOCK.icon:ICONS.USER_LOCK.icon}
            onClick={() =>handleOpenConfirm('UserStatus')}
            />
          )}

          {/* User Invitation */}
          {handleUserInvite && id!==userId &&(
            <IconTooltip
            title="Resend Invitation"
            disabled={ isSecurityReadOnly }
            color={ isSecurityReadOnly ? "#c3c3c3":theme.palette.secondary.main}
            icon={ICONS.USER_INVITE.icon}
            onClick={() => {
              handleOpenConfirm('UserInvite');
            }}

            />
          )}

        {/* map toggle button on mobile */}
        {sites && !isMobile && <IconPopover onMapClick={() => handleMap()} sites={sites} />}

        {/* machine transfer */}
        {handleTransfer && (
          <IconTooltip
            title="Transfer Ownership"
            disabled={disableTransferButton}
            onClick={() => { handleTransfer() }}
            color={disableTransferButton?"#c3c3c3":theme.palette.primary.main}
            icon="mdi:cog-transfer-outline"
          />
        )}

        {isSubmitted && (
          <IconTooltip
            title="Return To Draft"
            // disabled={...}
            onClick={() => {
              handleOpenConfirm('ChangeConfigStatusToDraft');
            }}
            color={theme.palette.primary.main}
            icon="carbon:license-maintenance-draft"
          />
        )}

        {returnToSubmitted && (
          <IconTooltip
            title="Submit"
            // disabled={...}
            onClick={() => {
              handleOpenConfirm('ChangeConfigStatusToSubmitted'); //
            }}
            color={theme.palette.primary.main}
            icon="iconoir:submit-document"
          />
        )}

          {/* approve configuration */}
          {approveHandler && !(approvers && approvers.length > 0 && approvers?.some((verified) => verified?.verifiedBy?._id === userId)) && <IconTooltip
          title="Approve"
          onClick={() => {
            handleOpenConfirm('ChangeConfigStatusToApprove'); //
            // approveHandler();
          }}
          color={theme.palette.primary.main}
          icon="mdi:approve"
        />}
        {copyConfiguration && (
          <IconTooltip
            title="Create Copy"
            // disabled={...}
            onClick={copyConfiguration}
            color={theme.palette.primary.main}
            icon="mingcute:copy-fill"
          />
        )}

        {/* change password for users */}
        {handleUpdatePassword && (
          <IconTooltip
            title="Change Password"
            disabled={( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly )}
            onClick={() => {
              handleUpdatePassword();
            }}
            color={(disablePasswordButton || ( ( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ) ))?"#c3c3c3":theme.palette.secondary.main}
            icon="solar:key-broken"
          />
        )}

        {/* move contact button */}
        {moveCustomerContact && <IconTooltip
          title="Move Conact"
          onClick={() => {
            moveCustomerContact();
          }}
          color={theme.palette.primary.main}
          icon="eva:swap-fill"
        />}

        {handleViewPDF && 
          <IconTooltip
            title="View PDF"
            onClick={handleViewPDF}
            color={theme.palette.primary.main}
            icon="mdi:file-pdf-box"
          />
        }

        {handleSendPDFEmail && 
          <IconTooltip
            title="Send Email"
            onClick={handleSendPDFEmail}
            color={theme.palette.primary.main}
            icon="mdi:email-send-outline"
          />
        }

        {/* edit button */}
        {handleEdit && <IconTooltip
          title="Edit"
          disabled={disableEditButton || (( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly ))}
          onClick={() => {
            handleEdit();
          }}
          color={disableEditButton || (( machineSettingPage || settingPage || securityUserPage ) && ( isSettingReadOnly || isSecurityReadOnly )) ?"#c3c3c3":theme.palette.primary.main}
          icon="mdi:pencil-outline"
        />}


        {hanldeViewGallery && (
          <IconTooltip
            title="View Gallery"
            onClick={hanldeViewGallery}
            // color="#c3c3c3"
            icon="ooui:image-gallery"
          />
        )}
        {/* delete button */}
        {id !== userId  && !mainSite && onDelete && (
          <IconTooltip
            title="Delete"
            disabled={ isDisableDelete || disableDeleteButton }
            onClick={() => {  handleOpenConfirm('delete') }}
            color={( isDisableDelete || disableDeleteButton ) ? "#c3c3c3":"#FF0000"}
            icon="mdi:trash-can-outline"
          />
        )}
      </StyledStack>

      <ConfirmDialog
        open={openUserInviteConfirm}
        onClose={() => { handleCloseConfirm('UserInvite'); }}
        title="Resend User Invitation"
        content="Are you sure you want resend invitation?"
        action={
          <LoadingButton
            variant="contained"
            color="primary"
            loading={isInviteLoading}
            disabled={isInviteLoading}
            onClick={()=>{setOpenUserInviteConfirm(false); handleUserInvite()}}
          >
            Send
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={openVerificationConfirm}
        onClose={() => {
          handleCloseConfirm('Verification');
        }}
        title="Verification"
        content="Are you sure you want to Verify Machine Informaton?"
        action={
          <LoadingButton
            variant="contained"
            color="primary"
            loading={isLoading}
            disabled={isSubmitting}
            onClick={handleSubmit(handleVerificationConfirm)}
            // onClick={()=> {handleVerification(); handleCloseConfirm('Verification');}}
          >
            Verify
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={openUserStatuConfirm}
        onClose={() => handleCloseConfirm('UserStatus')}
        title={userStatus?.locked?"Unlock User":"Lock User"}
        content={
          <Box rowGap={2} display="grid">
            Are you sure you want to {userStatus?.locked?"Unlock User":"Lock User"}?
            {!userStatus?.locked &&
            <DateTimePicker
              fullWidth
              sx={{mt:2}}
              label="Lock Until"
              name="lockUntil"
              value={lockUntil}
              onChange={handleLockUntilChange}
              renderInput={params => <TextField {...params} error={!!lockUntilError} helperText={lockUntilError} />}
            />
            }
          </Box>
        }
        action={
          <LoadingButton variant="contained" onClick={handleChangeUserStatus}>
            {userStatus?.locked?"Unlock User":"Lock User"}
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={openConfigDraftStatuConfirm}
        onClose={() => handleCloseConfirm('ChangeConfigStatusToDraft')}
        title="Configuration Status"
        content="Are you sure you want to change configuration status to DRAFT? "
        action={
          <LoadingButton variant="contained"
            onClick={()=>{
              setOpenConfigDraftStatuConfirm(false);
              isSubmitted();
            }}
          >
          Yes
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={openConfigSubmittedStatuConfirm}
        onClose={() => handleCloseConfirm('ChangeConfigStatusToSubmitted')}
        title="Configuration Status"
        content="Do you want to submit it for Approval? "
        action={
          <LoadingButton variant="contained"
            onClick={()=>{
              setOpenConfigSubmittedStatuConfirm(false);
              returnToSubmitted();
            }}
          >
          Yes
          </LoadingButton>
        }
      />

  <ConfirmDialog
        open={openConfigApproveStatuConfirm}
        onClose={() => handleCloseConfirm('ChangeConfigStatusToApprove')}
        title="Configuration Approval"
        content="Are you sure you want to APPROVE configuration? "
        action={
          <LoadingButton variant="contained"
            onClick={()=>{
              setOpenConfigApproveStatuConfirm(false);
              approveHandler();
            }}
          >
          Yes
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={() => {
          handleCloseConfirm('delete');
        }}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={(isSubmitSuccessful || isSubmitting) && isLoading}
            disabled={isSubmitting}
            onClick={handleSubmit(onDelete)}
          >
            Delete
          </LoadingButton>
        }
      />

      <ViewFormMenuPopover
        open={verifiedAnchorEl}
        onClose={handleVerifiedPopoverClose}
        ListArr={verifiedBy}
        ListTitle={isVerifiedTitle || "Verified By"}
      />

      <ViewFormApprovalsPopover
        open={approvedAnchorEl}
        onClose={handleApprovedPopoverClose}
        ListArr={approvedBy}
        ListTitle= "Approved By"
      />
    </Grid>

    </Grid>
  );
}
export default memo(ViewFormEditDeleteButtons)
ViewFormEditDeleteButtons.propTypes = {
  backLink: PropTypes.func,
  handleVerification: PropTypes.any,
  handleVerificationTitle: PropTypes.string,
  verifiers: PropTypes.array,
  approvers: PropTypes.array,
  isVerifiedTitle: PropTypes.string,
  approveConfiglength: PropTypes.string,
  isActive: PropTypes.bool,
  isDeleteDisabled: PropTypes.bool,
  isDefault: PropTypes.bool,
  isSubmitted: PropTypes.func,
  returnToSubmitted: PropTypes.func,
  customerAccess:PropTypes.bool,
  multiAuth:PropTypes.bool,
  currentEmp:PropTypes.bool,
  isRequired:PropTypes.bool,
  handleTransfer: PropTypes.func,
  handleUpdatePassword: PropTypes.func,
  handleUserInvite: PropTypes.func,
  handleSendPDFEmail: PropTypes.func,
  handleViewPDF: PropTypes.func,
  isInviteLoading:PropTypes.bool,
  handleEdit: PropTypes.func,
  onDelete: PropTypes.func,
  type: PropTypes.string,
  sites: PropTypes.bool,
  mainSite: PropTypes.bool,
  disableTransferButton: PropTypes.bool,
  disablePasswordButton: PropTypes.bool,
  disableDeleteButton: PropTypes.bool,
  disableEditButton: PropTypes.bool,
  handleMap: PropTypes.func,
  machineSupportDate: PropTypes.string,
  moveCustomerContact: PropTypes.func,
  approveConfig: PropTypes.bool,
  approveHandler: PropTypes.func,
  copyConfiguration: PropTypes.func,
  supportSubscription: PropTypes.bool,
  userStatus:PropTypes.object,
  onUserStatusChange:PropTypes.func,
  financingCompany: PropTypes.bool,
  isLoading: PropTypes.bool,
  excludeReports: PropTypes.bool,
  isConectable: PropTypes.bool,
  machineSettingPage: PropTypes.bool,
  settingPage: PropTypes.bool,
  securityUserPage: PropTypes.bool,
  hanldeViewGallery: PropTypes.func,
};
