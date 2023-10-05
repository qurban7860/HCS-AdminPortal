import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { Badge, Divider, Grid, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// import { Button, Typography, IconButton } from '@mui/material';
import { green } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { StyledStack } from '../../../theme/styles/default-styles';
import ConfirmDialog from '../../../components/confirm-dialog';
// import Iconify from '../../../components/iconify';
import useResponsive from '../../../hooks/useResponsive';
import { setTransferDialogBoxVisibility } from '../../../redux/slices/products/machine';
import IconPopover from '../Icons/IconPopover';
import IconTooltip from '../Icons/IconTooltip';
import ViewFormField from './ViewFormField';
import ViewFormMenuPopover from './ViewFormMenuPopover';
import { ICONS } from '../../../constants/icons/default-icons';
import { fDate } from '../../../utils/formatTime';

export default function ViewFormEditDeleteButtons({
  backLink,
  disableTransferButton = false,
  disableDeleteButton = false,
  disablePasswordButton = false,
  disableEditButton = false,
  isActive,
  isVerified,
  customerAccess,
  multiAuth,
  currentEmp,
  isRequired,
  handleVerification,
  onDelete,
  handleEdit,
  handleTransfer,
  handleUpdatePassword,
  handleUserInvite,
  isInviteLoading,
  type,
  sites,
  mainSite,
  handleMap,
  machineSupportDate,
  moveCustomerContact,
  supportSubscription
}) {
  const { id } = useParams();
  const userId = localStorage.getItem('userId');
  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const { isLoading, transferDialogBoxVisibility } = useSelector((state) => state.machine);
  // const { site } = useSelector((state) => state.site);
  // const { customer } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openUserInviteConfirm, setOpenUserInviteConfirm] = useState(false);
  
  const [openVerificationConfirm, setOpenVerificationConfirm] = useState(false);
  const theme = createTheme({
    palette: {
      success: green,
    },
  });
  // const [openTransferConfirm, setOpenTransferConfirm] = useState(false);
  // const [openPopover, setOpenPopover] = useState(null);
  // const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  // const [deleteButtonColor, setDeleteButtonColor] = useState('error.main');
  // const [deleteButtonHoverColor, setDeleteButtonHoverColor] = useState('error.dark');
  const disableDelete = userRoles.some((role) => role?.disableDelete === true);

  if (disableDelete) {
    disableDeleteButton = true;
  }

  const handleOpenConfirm = (dialogType) => {
    if (dialogType === 'UserInvite') {
      setOpenUserInviteConfirm(true);
    }

    if (dialogType === 'Verification') {
      setOpenVerificationConfirm(true);
    }

    if (dialogType === 'delete' && !disableDeleteButton) {
      setOpenConfirm(true);
    }

    if (dialogType === 'transfer') {
      dispatch(setTransferDialogBoxVisibility(true));
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
  };

  const handleVerificationConfirm = () => {
    handleVerification();
    handleCloseConfirm('Verification');
  };
  // const handlePopoverOpen = (event) => {
  //   setAnchorEl(event.currentTarget);
  //   setIsPopoverOpen(true);
  // };
  // const handlePopoverClose = () => {
  //   setAnchorEl(null);
  //   setIsPopoverOpen(false);
  // };
  const [verifiedAnchorEl, setVerifiedAnchorEl] = useState(null);
  const [verifiedBy, setVerifiedBy] = useState([]);
  const handleVerifiedPopoverOpen = (event) => {
    setVerifiedAnchorEl(event.currentTarget);
    setVerifiedBy(isVerified)
  };

  const handleVerifiedPopoverClose = () => {
    setVerifiedAnchorEl(null);
    setVerifiedBy([])
  };

  // const [anchorEl, setAnchorEl] = useState(null);
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
    <Grid container justifyContent="space-between">
      <Grid item sx={{display:'flex'}}>
        <StyledStack sx={{ml:2}}>
          {backLink && 
            <>
              <IconTooltip
                title='Back'
                onClick={() => backLink()}
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

          {supportSubscription!==undefined &&
            <IconTooltip
            title={supportSubscription?`Support Subscription Enabled`:`Support Subscription Disabled`}
            color={supportSubscription?ICONS.ALLOWED.color:ICONS.DISALLOWED.color}
            icon="bx:support"
            />
          }
          
          {machineSupportDate &&
            <IconTooltip
              title={machineSupport?.status?`Support valid till ${fDate(machineSupportDate)}`:`Support ended ${fDate(machineSupportDate)}`}
              color={machineSupport?.status?ICONS.ALLOWED.color:ICONS.DISALLOWED.color}
              icon="bx:support"
              />
          }
          
          {isVerified?.length>0 &&
          <Badge badgeContent={isVerified.length} color="info">
            <IconTooltip
              title='Verified'
              color={ICONS.ALLOWED.color}
              icon="ic:outline-verified-user"
              onClick={handleVerifiedPopoverOpen}
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
        </StyledStack>
      </Grid>

      <Grid item  >
        <StyledStack>
          {handleVerification && !isVerified?.length && (
          <IconTooltip
            title='Verify'
            onClick={() => { handleOpenConfirm('Verification');}}
            color={theme.palette.primary.main}
            icon="ic:outline-verified-user"
          />
        )}

        {/* User Invitation */}
        {handleUserInvite && id!==userId &&(
          <IconTooltip 
          title="Resend Invitation"
          disabled={disableDeleteButton}
          color={disableDeleteButton?"#c3c3c3":theme.palette.secondary.main}
          icon="mdi:person-add-outline"
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
            onClick={() => {
              handleOpenConfirm('transfer');
            }}
            color={disableTransferButton?"#c3c3c3":theme.palette.primary.main}
            icon="mdi:cog-transfer-outline"
          />
        )}

        {/* change password for users */}
        {handleUpdatePassword && (
          <IconTooltip
            title="Change Password"
            onClick={() => {
              handleUpdatePassword();
            }}
            color={theme.palette.secondary.main}
            color={disablePasswordButton?"#c3c3c3":theme.palette.secondary.main}
            icon="mdi:account-key-outline"
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
        
        {/* edit button */}
        {handleEdit && <IconTooltip
          title="Edit"
          disabled={disableEditButton}
          onClick={() => {
            handleEdit();
          }}
          color={disableEditButton?"#c3c3c3":theme.palette.primary.main}
          icon="mdi:pencil-outline"
        />}

        {/* delete button */}
        {id !== userId  && !mainSite && onDelete && (
          <IconTooltip
            title="Delete"
            disabled={disableDeleteButton}
            onClick={() => {
              handleOpenConfirm('delete');
            }}
            color={disableDeleteButton?"#c3c3c3":theme.palette.error.main}
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
      <ConfirmDialog
        open={transferDialogBoxVisibility}
        onClose={() => {
          handleCloseConfirm('transfer');
        }}
        title="Ownership Transfer"
        content="Are you sure you want to transfer machine ownership?"
        action={
          <LoadingButton
            color="error"
            variant="contained"
            loading={isLoading}
            onClick={handleTransfer}
          >
            Transfer
          </LoadingButton>
        }
      />

      <ViewFormMenuPopover
        open={verifiedAnchorEl}
        onClose={handleVerifiedPopoverClose}
        ListArr={verifiedBy}
        ListTitle="Verified By"
      />
    </Grid>

    </Grid>
  );
}

ViewFormEditDeleteButtons.propTypes = {
  backLink: PropTypes.func,
  handleVerification: PropTypes.func,
  isVerified: PropTypes.array,
  isActive:PropTypes.bool,
  customerAccess:PropTypes.bool,
  multiAuth:PropTypes.bool,
  currentEmp:PropTypes.bool,
  isRequired:PropTypes.bool,
  handleTransfer: PropTypes.func,
  handleUpdatePassword: PropTypes.func,
  handleUserInvite: PropTypes.func,
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
  supportSubscription: PropTypes.bool
};
