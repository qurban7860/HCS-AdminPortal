import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { Grid, Tooltip } from '@mui/material';
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

export default function ViewFormEditDeleteButtons({
  backLink,
  disableTransferButton = false,
  disableDeleteButton = false,
  disablePasswordButton = false,
  disableEditButton = false,
  isVerified,
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
    if (dialogType === 'UserInvite' && !isVerified) {
      setOpenUserInviteConfirm(true);
    }

    if (dialogType === 'Verification' && !isVerified) {
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

  // const [anchorEl, setAnchorEl] = useState(null);
  const { isMobile } = useResponsive('down', 'sm');

  const methods = useForm();

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = methods;
  return (
    <Grid container >

      <Grid item sm={6} sx={{display:'flex'}}>

      {backLink && <>
        {/* <StyledStack sx>
          <IconTooltip
            title='Back'
            onClick={() => backLink()}
            color={theme.palette.primary.main}
            icon="ion:arrow-back-circle"
          />
        </StyledStack> */}
        <Tooltip>
          <ViewFormField backLink={backLink} />
        </Tooltip>
      </>}
      </Grid>

      <Grid item sm={6} >
        <StyledStack>
          {handleVerification && !isVerified && (
          <IconTooltip
            title={isVerified ? 'Verified' : 'Verify'}
            // disabled={disableTransferButton}
            onClick={() => {
              handleOpenConfirm('Verification');
            }}
            color={theme.palette.primary.main}
            icon="ic:round-verified-user"
          />
        )}

        {/* User Invitation */}
        {handleUserInvite && id!==userId &&(
          <IconTooltip 
          title="Resend Invitation"
          disabled={disableDeleteButton}
          color={theme.palette.secondary.main}
          icon="mdi:person-add"
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
            color={theme.palette.primary.main}
            icon="mdi:cog-transfer-outline"
          />
        )}

        {/* change password for users */}
        {handleUpdatePassword && (
          <IconTooltip
            title="Change Password"
            disabled={disablePasswordButton}
            onClick={() => {
              handleUpdatePassword();
            }}
            color={theme.palette.secondary.main}
            icon="mdi:account-key"
          />
        )}

        {/* edit button */}
        {handleEdit && <IconTooltip
          title="Edit"
          disabled={disableEditButton}
          onClick={() => {
            handleEdit();
          }}
          color={theme.palette.primary.main}
          icon="mdi:pencil"
        />}

        {/* delete button */}
        {id !== userId  && !mainSite && onDelete && (
          <IconTooltip
            title="Delete"
            disabled={disableDeleteButton}
            onClick={() => {
              handleOpenConfirm('delete');
            }}
            color={theme.palette.error.light}
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
    </Grid>

    </Grid>
  );
}

ViewFormEditDeleteButtons.propTypes = {
  backLink: PropTypes.func,
  handleVerification: PropTypes.func,
  isVerified: PropTypes.bool,
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
};
