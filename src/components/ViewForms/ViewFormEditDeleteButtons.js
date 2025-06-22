import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { Badge, Box, Divider, Grid, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { memo, useState, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import ViewFormTransferHistoryMenuPopover from './ViewFormTransferHistoryMenuPopover';
import ViewFormMachineSettingHistoryMenuPopover from './ViewFormMachineSettingHistoryMenuPopover';
import ViewFormApprovalsPopover from './ViewFormApprovalsPopover';
import { ICONS } from '../../constants/icons/default-icons';
import { fDate, fDateTime, GetDifferenceInDays } from '../../utils/formatTime';
import { useAuthContext } from '../../auth/useAuthContext';
import { PATH_DASHBOARD } from '../../routes/paths';
import ViewFormServiceReportApprovalHistoryPopover from './ViewFormServiceReportApprovalHistoryPopover';
import ContactUsersPopover from './ContactUsersPopover';

function ViewFormEditDeleteButtons({
  backLink,
  isActive,
  isPrimary,
  shareWith,
  isReleased,
  isDefault,
  isResolved,
  isIniRead,
  isManufacture,
  isDeleteDisabled,
  customerAccess,
  forCustomer,
  formerEmployee,
  isRequired,
  multiAuth,
  currentEmp,
  machineSettingPage,
  settingPage,
  securityUserPage,
  transferredHistory,
  // Handlers
  handleVerification,
  handleVerificationTitle,
  onArchive,
  onRestore,
  onDelete,
  handleEdit,
  handleJiraNaviagte,
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
  hanldeViewGallery,
  customerPage,
  archived,
  machinePage,
  drawingPage,
  history,
  onMergeDocumentType,
  serviceReportStatus,
  invitationStatus,
  onCancelInvite,
  handleViewUser,
  showContactUsers = false,
  onResendInvite,
}) {
  const { id } = useParams();
  const navigate = useNavigate()
  const userId = localStorage.getItem('userId');

  const {
    isDisableDelete,
    isSettingReadOnly,
    isSecurityReadOnly,
    isDocumentAccessAllowed,
    isDrawingAccessAllowed,
    isSettingAccessAllowed,
    isSecurityUserAccessAllowed, } = useAuthContext();

  const dispatch = useDispatch();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [openRestoreConfirm, setOpenRestoreConfirm] = useState(false);
  const [openUserInviteConfirm, setOpenUserInviteConfirm] = useState(false);
  const [openVerificationConfirm, setOpenVerificationConfirm] = useState(false);
  const [openUserStatuConfirm, setOpenUserStatuConfirm] = useState(false);
  const [openConfigDraftStatuConfirm, setOpenConfigDraftStatuConfirm] = useState(false);
  const [openConfigSubmittedStatuConfirm, setOpenConfigSubmittedStatuConfirm] = useState(false);
  const [openConfigApproveStatuConfirm, setOpenConfigApproveStatuConfirm] = useState(false);
  const [openResendInviteConfirm, setOpenResendInviteConfirm] = useState(false);
  const { machine } = useSelector((state) => state.machine);
  const { contactUsers } = useSelector((state) => state.user);
  const [lockUntil, setLockUntil] = useState('');
  const [lockUntilError, setLockUntilError] = useState('');

  const isCustomerSelected = !!machine?.customer;
  const hasPurchaseDate = !!transferredHistory?.some((historyItem) => historyItem.purchaseDate);
  const hasTransferDate = !!transferredHistory?.some((historyItem) => historyItem.transferredDate);
  const showDetails = isCustomerSelected && (hasPurchaseDate || hasTransferDate);

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
    } else {

      if (lockUntil) {
        const timeDifference = new Date(lockUntil) - new Date();
        const minutesDifference = timeDifference / (1000 * 60);
        onUserStatusChange(minutesDifference);
      } else {
        onUserStatusChange(0);
      }
      setOpenUserStatuConfirm(false);
    }
    setLockUntil('');
  };

  useLayoutEffect(() => {
    if ((machineSettingPage || settingPage || securityUserPage) && (!isSettingAccessAllowed || !isSecurityUserAccessAllowed || !isDocumentAccessAllowed || (!isDrawingAccessAllowed))) {
      navigate(PATH_DASHBOARD.root)
    }
  }, [
    machineSettingPage,
    settingPage,
    securityUserPage,
    isSettingAccessAllowed,
    isSecurityUserAccessAllowed,
    isDocumentAccessAllowed,
    isDrawingAccessAllowed,
    drawingPage,
    customerPage,
    machinePage,
    navigate
  ])

  const handleOpenConfirm = (dialogType) => {

    if (dialogType === 'UserInvite') {
      setOpenUserInviteConfirm(true);
    }

    if (dialogType === 'Verification') {
      setOpenVerificationConfirm(true);
    }

    if (dialogType === 'delete' && (!isDisableDelete || !disableDeleteButton)) {
      setOpenConfirm(true);
    }

    if (dialogType === 'restore' && !isDisableDelete) {
      setOpenRestoreConfirm(true);
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

    if (dialogType === 'ResendInvite') {
      setOpenResendInviteConfirm(true);
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
    if (dialogType === 'delete' || dialogType === 'restore') {
      reset();
      setOpenConfirm(false);
    }

    if (dialogType === 'restore') {
      reset();
      setOpenRestoreConfirm(false);
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

    if (dialogType === 'ResendInvite') {
      setOpenResendInviteConfirm(false);
    }

  };

  const handleVerificationConfirm = () => {
    handleVerification();
    handleCloseConfirm('Verification');
  };

  const handleDelete = async () => {
    await onDelete();
    await handleCloseConfirm('delete');
  };

  const handleArchive = async () => {
    await onArchive();
    await handleCloseConfirm('delete');
  };

  const handleRestore = async () => {
    await onRestore();
    await setOpenRestoreConfirm(false);
  };


  const [verifiedAnchorEl, setVerifiedAnchorEl] = useState(null);
  const [verifiedBy, setVerifiedBy] = useState([]);

  const [transferHistoryAnchorEl, setTransferHistoryAnchorEl] = useState(null);
  const [transferHistory, setTransferHistory] = useState([]);

  const [serviceReportApprovalHistoryAnchorEl, setServiceReportApprovalHistoryAnchorEl] = useState(null);

  const [machineSettingHistoryAnchorEl, setMachineSettingHistoryAnchorEl] = useState(null);

  const [approvedAnchorEl, setApprovedAnchorEl] = useState(null);
  const [approvedBy, setApprovedBy] = useState([]);

  const [contactUsersAnchorEl, setContactUsersAnchorEl] = useState(null);

  const handleContactUsersPopoverOpen = (event) => {
    setContactUsersAnchorEl(event.currentTarget);
  };

  const handleContactUsersPopoverClose = () => {
    setContactUsersAnchorEl(null);
  };

  const handleVerifiedPopoverOpen = (event) => {
    setVerifiedAnchorEl(event.currentTarget);
    setVerifiedBy(verifiers)
  };

  const handleVerifiedPopoverClose = () => {
    setVerifiedAnchorEl(null);
    setVerifiedBy([])
  };

  const handleTransferHistoryPopoverOpen = (event) => {
    if (transferredHistory?.length > 0) {
      setTransferHistoryAnchorEl(event.currentTarget);
      setTransferHistory(transferredHistory)
    }
  };

  const handleTransferHistoryPopoverClose = () => {
    setTransferHistoryAnchorEl(null);
    setTransferHistory([])
  };

  const handleServiceReportApprovalHistoryPopoverOpen = (event) => {
    if (serviceReportStatus?.approvalLogs?.length > 0) {
      setServiceReportApprovalHistoryAnchorEl(event.currentTarget);
    }
  };

  const handleServiceReportApprovalHistoryPopoverClose = () => {
    setServiceReportApprovalHistoryAnchorEl(null);
  };

  const handleMachineSettingHistoryPopoverOpen = (event) => {
    if (history?.length > 1) {
      setMachineSettingHistoryAnchorEl(event.currentTarget);
    }
  };

  const handleMachineSettingHistoryPopoverClose = () => {
    setMachineSettingHistoryAnchorEl(null);
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
    formState: { isSubmitting },
  } = methods;

  const machineSupport = {
    status: GetDifferenceInDays(machineSupportDate),
    date: new Date(machineSupportDate)
  }

  return (
    <Grid container justifyContent="space-between" sx={{ pb: 1, px: 0.5 }}>
      <Grid item sx={{ display: 'flex', mt: 0.5, mr: 1 }}>
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
              <Divider orientation="vertical" flexItem />
            </>
          }
          {isReleased !== undefined &&
            <IconTooltip
              title={isReleased ? ICONS.RELEASE.heading : ICONS.NOTRELEASE.heading}
              color={isReleased ? ICONS.RELEASE.color : ICONS.NOTRELEASE.color}
              icon={isReleased ? ICONS.RELEASE.icon : ICONS.NOTRELEASE.icon}
            />
          }

          {isActive !== undefined &&
            <IconTooltip
              title={isActive ? ICONS.ACTIVE.heading : ICONS.INACTIVE.heading}
              color={isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color}
              icon={isActive ? ICONS.ACTIVE.icon : ICONS.INACTIVE.icon}
            />
          }

          {isPrimary !== undefined &&
            <IconTooltip
              title={isPrimary ? ICONS.PRIMARY.heading : ICONS.NOTPRIMARY.heading}
              color={isPrimary ? ICONS.PRIMARY.color : ICONS.NOTPRIMARY.color}
              icon={isPrimary ? ICONS.PRIMARY.icon : ICONS.NOTPRIMARY.icon}
            />
          }


          {/* Status icons */}
          {invitationStatus === 'PENDING' && (
            <IconTooltip
              title="Pending Invitation"
              color={ICONS.SR_PENDING.color}
              icon={ICONS.SR_PENDING.icon}
            />
          )}
          {invitationStatus === 'REVOKED' && (
            <IconTooltip
              title="Revoked Invitation"
              color={ICONS.SR_REJECTED.color}
              icon="mdi:cancel-circle"
            />
          )}
          {invitationStatus === 'ACCEPTED' && (
            <IconTooltip
              title="Accepted Invitation"
              color={ICONS.SR_APPROVED.color}
              icon={ICONS.SR_APPROVED.icon}
            />
          )}

          {shareWith !== undefined &&
            <IconTooltip
              title={shareWith ? ICONS.SHARED.heading : ICONS.NONSHARED.heading}
              color={shareWith ? ICONS.SHARED.color : ICONS.NONSHARED.color}
              icon={shareWith ? ICONS.SHARED.icon : ICONS.NONSHARED.icon}
            />
          }
          {isIniRead !== undefined &&
            <IconTooltip
              title={isIniRead ? ICONS.READINI.heading : ICONS.NOTREADINI.heading}
              color={isIniRead ? ICONS.READINI.color : ICONS.NOTREADINI.color}
              icon={isIniRead ? ICONS.READINI.icon : ICONS.NOTREADINI.icon}
            />
          }

          {isManufacture !== undefined &&
            <IconTooltip
              title={isManufacture ? ICONS.MANUFACTURE.heading : ICONS.NOTMANUFACTURE.heading}
              color={isManufacture ? ICONS.MANUFACTURE.color : ICONS.NOTMANUFACTURE.color}
              icon={isManufacture ? ICONS.MANUFACTURE.icon : ICONS.NOTMANUFACTURE.icon}
            />
          }

          {isDeleteDisabled !== undefined &&
            <IconTooltip
              title={isDeleteDisabled ? ICONS.DELETE_ENABLED.heading : ICONS.DELETE_DISABLED.heading}
              color={isDeleteDisabled ? ICONS.DELETE_ENABLED.color : ICONS.DELETE_DISABLED.color}
              icon={isDeleteDisabled ? ICONS.DELETE_ENABLED.icon : ICONS.DELETE_DISABLED.icon}
            />
          }
          {isResolved &&
            <IconTooltip
              title={isResolved ? ICONS.RESOLVED.heading : ICONS.UNRESOLVED.heading}
              color={isResolved ? ICONS.RESOLVED.color : ICONS.UNRESOLVED.color}
              icon={isResolved ? ICONS.RESOLVED.icon : ICONS.UNRESOLVED.icon}
            />
          }
          {isDefault &&
            <IconTooltip
              title={isDefault ? ICONS.DEFAULT.heading : ICONS.CONTRAST.heading}
              color={isDefault ? ICONS.DEFAULT.color : ICONS.CONTRAST.color}
              icon={isDefault ? ICONS.DEFAULT.icon : ICONS.CONTRAST.icon}
            />}

          {supportSubscription !== undefined &&
            <IconTooltip
              title={supportSubscription ? `Support Subscription Enabled` : `Support Subscription Disabled`}
              color={supportSubscription ? ICONS.ALLOWED.color : ICONS.DISALLOWED.color}
              icon="bx:support"
            />
          }

          {financingCompany !== undefined &&
            <IconTooltip
              title={financingCompany ? `Financing Company Enabled` : `Financing Company Disabled`}
              color={financingCompany ? ICONS.ALLOWED.color : ICONS.DISALLOWED.color}
              icon="vaadin:office"
            />
          }

          {excludeReports &&
            <IconTooltip title={ICONS.EXCLUDE_REPORTING.heading} color={ICONS.EXCLUDE_REPORTING.color}
              icon={ICONS.EXCLUDE_REPORTING.icon} />
          }

          {machineSupportDate !== undefined &&
            <IconTooltip
              title={!Number.isNaN(machineSupport?.status) && (machineSupport?.status > 0 ? `Support valid till ${fDate(machineSupportDate)}` : `Support ended ${fDate(machineSupportDate)}`) || 'Support not available!'}
              color={machineSupport?.status > 30 && ICONS.SUPPORT_VALLID.color || machineSupport?.status < 30 && machineSupport?.status > 0 && ICONS.SUPPORT_WARNING.color || machineSupport?.status < 1 && ICONS.SUPPORT_EXPIRED.color || ICONS.SUPPORT_EXPIRED.color}
              icon={machineSupport?.status ? ICONS.SUPPORT_VALLID.icon : ICONS.SUPPORT_EXPIRED.icon}
            />
          }

          {Array.isArray(verifiers) && verifiers?.length > 0 &&
            <Badge badgeContent={verifiers.length} color="info">
              <IconTooltip
                title={isVerifiedTitle || 'Verified'}
                color={ICONS.ALLOWED.color}
                icon="ic:outline-verified-user"
                onClick={handleVerifiedPopoverOpen}
              />
            </Badge>
          }

          {showDetails && transferredHistory !== undefined && transferredHistory?.length > 0 &&
            <Badge badgeContent={transferredHistory?.length || '0'} color="info">
              <IconTooltip
                title='Ownership History'
                color={ICONS.TRANSFERHISTORY.color}
                icon={ICONS.TRANSFERHISTORY.icon}
                onClick={handleTransferHistoryPopoverOpen}
              />
            </Badge>
          }

          {history !== undefined && history.length > 1 &&
            <Badge badgeContent={history?.length || '0'} color="info">
              <IconTooltip
                title='History'
                color={ICONS.MACHINESETTINGHISTORY.color}
                icon={ICONS.MACHINESETTINGHISTORY.icon}
                onClick={handleMachineSettingHistoryPopoverOpen}
              />
            </Badge>
          }

          {approveConfiglength !== undefined &&
            <Badge badgeContent={approveConfiglength} color="info">
              <IconTooltip
                title={approveConfig ? ICONS.APPROVED.heading : ICONS.NOTAPPROVED.heading}
                color={approveConfig ? ICONS.APPROVED.color : ICONS.NOTAPPROVED.color}
                icon={approveConfig ? ICONS.APPROVED.icon : ICONS.NOTAPPROVED.icon}
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

          {forCustomer !== undefined &&
            <IconTooltip
              title={forCustomer ? ICONS.FORCUSTOMER.heading : ICONS.NOTFORCUSTOMER.heading}
              color={forCustomer ? ICONS.FORCUSTOMER.color : ICONS.NOTFORCUSTOMER.color}
              icon={forCustomer ? ICONS.FORCUSTOMER.icon : ICONS.NOTFORCUSTOMER.icon}
            />
          }

          {formerEmployee !== undefined &&
            <IconTooltip
              title={formerEmployee ? ICONS.FORMEREMPLOYEE.heading : ICONS.NOTFORMEREMPLOYEE.heading}
              color={formerEmployee ? ICONS.FORMEREMPLOYEE.color : ICONS.NOTFORMEREMPLOYEE.color}
              icon={formerEmployee ? ICONS.FORMEREMPLOYEE.icon : ICONS.NOTFORMEREMPLOYEE.icon}
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
              title={userStatus?.locked ? `User locked by ${userStatus?.lockedBy} until ${fDateTime(userStatus?.lockedUntil)}` : "User Unlocked"}
              color={userStatus?.locked ? ICONS.USER_LOCK.color : ICONS.USER_UNLOCK.color}
              icon={userStatus?.locked ? ICONS.USER_LOCK.icon : ICONS.USER_UNLOCK.icon}
            />
          }

          {isConectable !== undefined &&
            <IconTooltip
              title={isConectable ? 'Connectable As Child' : "Not Connectable As Child"}
              color={isConectable ? ICONS.ALLOWED.color : ICONS.DISALLOWED.color}
              icon={isConectable ? 'material-symbols:cast-connected-rounded' : "material-symbols:cast-connected-rounded"}
            />
          }

          {serviceReportStatus && (
            <Badge badgeContent={serviceReportStatus?.approvalLogs?.length || 0} color="info">
              {serviceReportStatus?.approvingContacts?.length > 0 ? (
                <>
                  {serviceReportStatus?.status === 'APPROVED' && (
                    <IconTooltip
                      title={ICONS.SR_APPROVED.heading}
                      color={ICONS.SR_APPROVED.color}
                      icon={ICONS.SR_APPROVED.icon}
                      onClick={handleServiceReportApprovalHistoryPopoverOpen}
                    />
                  )}
                  {serviceReportStatus?.status === 'REJECTED' && (
                    <IconTooltip
                      title={ICONS.SR_REJECTED.heading}
                      color={ICONS.SR_REJECTED.color}
                      icon={ICONS.SR_REJECTED.icon}
                      onClick={handleServiceReportApprovalHistoryPopoverOpen}
                    />
                  )}
                  {serviceReportStatus?.status === 'PENDING' && (
                    <IconTooltip
                      title={ICONS.SR_PENDING.heading}
                      color={ICONS.SR_PENDING.color}
                      icon={ICONS.SR_PENDING.icon}
                      onClick={handleServiceReportApprovalHistoryPopoverOpen}
                    />
                  )}
                </>
              ) : (
                <IconTooltip
                  title={ICONS.SR_HISTORY.heading}
                  color={ICONS.SR_HISTORY.color}
                  icon={ICONS.SR_HISTORY.icon}
                  onClick={handleServiceReportApprovalHistoryPopoverOpen}
                />
              )}
            </Badge>
          )}
        </StyledStack>
      </Grid>

      <Grid item sx={{ ml: 'auto', mt: 0.5 }}>
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
          {onUserStatusChange && !isSecurityReadOnly && id !== userId && (
            <IconTooltip
              title={userStatus?.locked ? ICONS.USER_UNLOCK.heading : ICONS.USER_LOCK.heading}
              color={userStatus?.locked ? ICONS.USER_UNLOCK.color : ICONS.USER_LOCK.color}
              icon={userStatus?.locked ? ICONS.USER_UNLOCK.icon : ICONS.USER_LOCK.icon}
              onClick={() => handleOpenConfirm('UserStatus')}
            />
          )}

          {/* User Invitation */}
          {handleUserInvite && id !== userId && (
            <IconTooltip
              title="Resend Invitation"
              disabled={isSecurityReadOnly}
              color={isSecurityReadOnly ? "#c3c3c3" : theme.palette.secondary.main}
              icon={ICONS.USER_INVITE.icon}
              onClick={() => {
                handleOpenConfirm('UserInvite');
              }}

            />
          )}

          {showContactUsers && (
            <>
          {Array.isArray(contactUsers) && contactUsers?.length > 0 &&
            <Badge badgeContent={contactUsers.length} color="info">
              <IconTooltip
                title="Contact Users"
                color={theme.palette.primary.main}
                icon={ICONS.USER_VIEW.icon}
                onClick={handleContactUsersPopoverOpen}
              />
            </Badge>
          }

          <ContactUsersPopover
            open={contactUsersAnchorEl}
            onClose={handleContactUsersPopoverClose}
            onViewUser={handleViewUser}
          />
        </>
        )}
      

          {/* map toggle button on mobile */}
          {sites && !isMobile && <IconPopover onMapClick={() => handleMap()} sites={sites} />}

          {/* machine transfer */}
          {handleTransfer && (
            <IconTooltip
              title="Transfer Ownership"
              disabled={disableTransferButton}
              onClick={() => { handleTransfer() }}
              color={disableTransferButton ? "#c3c3c3" : theme.palette.primary.main}
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

          {/* approve template */}
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
              disabled={(machineSettingPage || settingPage || securityUserPage) && (isSettingReadOnly || isSecurityReadOnly)}
              onClick={() => {
                handleUpdatePassword();
              }}
              color={(disablePasswordButton || ((machineSettingPage || settingPage || securityUserPage) && (isSettingReadOnly || isSecurityReadOnly))) ? "#c3c3c3" : theme.palette.secondary.main}
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
          {handleEdit && !archived && <IconTooltip
            title="Edit"
            disabled={disableEditButton || ((machineSettingPage || settingPage || securityUserPage) && (isSettingReadOnly || isSecurityReadOnly))}
            onClick={() => {
              handleEdit();
            }}
            color={disableEditButton || ((machineSettingPage || settingPage || securityUserPage) && (isSettingReadOnly || isSecurityReadOnly)) ? "#c3c3c3" : theme.palette.primary.main}
            icon="mdi:pencil-outline"
          />}

          {handleJiraNaviagte && <IconTooltip
            title="Jira"
            disabled={disableEditButton || ((machineSettingPage || settingPage || securityUserPage) && (isSettingReadOnly || isSecurityReadOnly))}
            onClick={() => {
              handleJiraNaviagte();
            }}
            color={disableEditButton || ((machineSettingPage || settingPage || securityUserPage) && (isSettingReadOnly || isSecurityReadOnly)) ? "#c3c3c3" : theme.palette.primary.main}
            icon="cib:jira"
          />}


          {hanldeViewGallery && (
            <IconTooltip
              title="View Gallery"
              onClick={hanldeViewGallery}
              // color="#c3c3c3"
              icon="ooui:image-gallery"
            />
          )}

          {/* onMergeDocumentType */}
          {onMergeDocumentType && (
            <IconTooltip title="Merge Document" onClick={onMergeDocumentType} icon="mdi:merge" />
          )}

          {/* restore button */}
          {onRestore && isSecurityUserAccessAllowed && !isSecurityReadOnly && (
            <IconTooltip title="Restore" onClick={() => { handleOpenConfirm('restore') }} icon="mdi:restore" />
          )}
          
          {/* delete button */}
          {id !== userId && !mainSite && (onArchive || onDelete) && !archived && (
            <IconTooltip
              title={onArchive ? "Archive" : "Delete"}
              disabled={isDisableDelete || disableDeleteButton}
              onClick={() => { handleOpenConfirm('delete') }}
              color={(isDisableDelete || disableDeleteButton) ? "#c3c3c3" : "#FF0000"}
              icon={onArchive ? "mdi:archive" : "mdi:delete"}
            />
          )}

          {(invitationStatus === 'PENDING' || invitationStatus === 'EXPIRED') && onResendInvite && (
            <IconTooltip
              title="Resend Invitation"
              onClick={() => handleOpenConfirm('ResendInvite')}
              color={theme.palette.primary.main}
              icon="mdi:email-send-outline"
            />
          )}

          {invitationStatus === 'PENDING' && onCancelInvite && (
            <IconTooltip
              title="Revoke Invitation"
              onClick={onCancelInvite}
              color="#FF0000"
              icon="mdi:file-cancel"
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
              onClick={() => { setOpenUserInviteConfirm(false); handleUserInvite() }}
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
          title={userStatus?.locked ? "Unlock User" : "Lock User"}
          content={
            <Box rowGap={2} display="grid">
              Are you sure you want to {userStatus?.locked ? "Unlock User" : "Lock User"}?
              {!userStatus?.locked &&
                <DateTimePicker
                  fullWidth
                  sx={{ mt: 2 }}
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
              {userStatus?.locked ? "Unlock User" : "Lock User"}
            </LoadingButton>
          }
        />

        <ConfirmDialog
          open={openConfigDraftStatuConfirm}
          onClose={() => handleCloseConfirm('ChangeConfigStatusToDraft')}
          title="Template Status"
          content="Are you sure you want to change this template status to DRAFT? "
          action={
            <LoadingButton variant="contained"
              onClick={() => {
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
          title="Template Status"
          content="Do you want to submit this template for Approval? "
          action={
            <LoadingButton variant="contained"
              onClick={() => {
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
          title="Template Approval"
          content="Are you sure you want to APPROVE this template? "
          action={
            <LoadingButton variant="contained"
              onClick={() => {
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
          title={onArchive ? "Archive" : "Delete"}
          content={`Are you sure you want to ${onArchive ? "Archive" : "Delete"}?`}
          action={
            <LoadingButton
              variant="contained"
              color="error"
              loading={isSubmitted || isSubmitting || isLoading}
              disabled={isSubmitted || isSubmitting || isLoading}
              onClick={handleSubmit(onArchive ? handleArchive : handleDelete)}
            >
              {onArchive ? "Archive" : "Delete"}
            </LoadingButton>
          }
        />

        <ConfirmDialog
          open={openRestoreConfirm}
          onClose={() => {
            handleCloseConfirm('restore');
          }}
          title="Restore"
          content="Are you sure you want to Restore?"
          action={
            <LoadingButton
              variant="contained"
              color="error"
              loading={isSubmitted || isSubmitting || isLoading}
              disabled={isSubmitted || isSubmitting || isLoading}
              onClick={handleSubmit(handleRestore)}
            >
              Restore
            </LoadingButton>
          }
        />

        <ConfirmDialog
          open={openResendInviteConfirm}
          onClose={() => {
            handleCloseConfirm('ResendInvite');
          }}
          title="Resend Invite"
          content="Are you sure you want to Resend Invite?"
          action={
            <LoadingButton
              variant="contained"
              loading={isSubmitted || isSubmitting || isLoading}
              disabled={isSubmitted || isSubmitting || isLoading}
              onClick={() => {
                handleCloseConfirm('ResendInvite');
                onResendInvite();
              }}
            >
              Resend Invite
            </LoadingButton>
          }
        />

        <ViewFormMenuPopover
          open={verifiedAnchorEl}
          onClose={handleVerifiedPopoverClose}
          ListArr={verifiedBy}
          ListTitle={isVerifiedTitle || "Verified By"}
        />

        <ViewFormTransferHistoryMenuPopover
          open={transferHistoryAnchorEl}
          onClose={handleTransferHistoryPopoverClose}
          ListArr={transferHistory}
          ListTitle="Ownership History"
        />

        <ViewFormMachineSettingHistoryMenuPopover
          open={machineSettingHistoryAnchorEl}
          onClose={handleMachineSettingHistoryPopoverClose}
          ListArr={history}
          ListTitle="History"
        />

        <ViewFormApprovalsPopover
          open={approvedAnchorEl}
          onClose={handleApprovedPopoverClose}
          ListArr={approvedBy}
          ListTitle="Approved By"
        />

        <ViewFormServiceReportApprovalHistoryPopover
          open={serviceReportApprovalHistoryAnchorEl}
          onClose={handleServiceReportApprovalHistoryPopoverClose}
          evaluationHistory={serviceReportStatus?.approvalLogs}
          ListTitle="Service Report Approval Details"
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
  isPrimary: PropTypes.bool,
  shareWith: PropTypes.bool,
  isReleased: PropTypes.bool,
  isIniRead: PropTypes.bool,
  isManufacture: PropTypes.bool,
  isDeleteDisabled: PropTypes.bool,
  isResolved: PropTypes.bool,
  isDefault: PropTypes.bool,
  isSubmitted: PropTypes.func,
  returnToSubmitted: PropTypes.func,
  customerAccess: PropTypes.bool,
  forCustomer: PropTypes.bool,
  formerEmployee: PropTypes.bool,
  multiAuth: PropTypes.bool,
  currentEmp: PropTypes.bool,
  isRequired: PropTypes.bool,
  handleTransfer: PropTypes.func,
  handleUpdatePassword: PropTypes.func,
  handleUserInvite: PropTypes.func,
  handleSendPDFEmail: PropTypes.func,
  handleViewPDF: PropTypes.func,
  isInviteLoading: PropTypes.bool,
  handleEdit: PropTypes.func,
  handleJiraNaviagte: PropTypes.func,
  onArchive: PropTypes.func,
  onRestore: PropTypes.func,
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
  transferredHistory: PropTypes.array,
  moveCustomerContact: PropTypes.func,
  approveConfig: PropTypes.bool,
  approveHandler: PropTypes.func,
  copyConfiguration: PropTypes.func,
  supportSubscription: PropTypes.bool,
  userStatus: PropTypes.object,
  onUserStatusChange: PropTypes.func,
  financingCompany: PropTypes.bool,
  isLoading: PropTypes.bool,
  excludeReports: PropTypes.bool,
  isConectable: PropTypes.bool,
  machineSettingPage: PropTypes.bool,
  settingPage: PropTypes.bool,
  securityUserPage: PropTypes.bool,
  hanldeViewGallery: PropTypes.func,
  customerPage: PropTypes.bool,
  archived: PropTypes.bool,
  machinePage: PropTypes.bool,
  drawingPage: PropTypes.bool,
  history: PropTypes.array,
  onMergeDocumentType: PropTypes.func,
  serviceReportStatus: PropTypes.object,
  invitationStatus: PropTypes.string,
  onCancelInvite: PropTypes.func,
  handleViewUser: PropTypes.func,
  showContactUsers: PropTypes.bool,
  onResendInvite: PropTypes.func,
};
