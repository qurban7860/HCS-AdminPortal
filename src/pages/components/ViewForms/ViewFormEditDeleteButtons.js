import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { green } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { StyledStack } from '../../../theme/styles/default-styles';
import ConfirmDialog from '../../../components/confirm-dialog';
import useResponsive from '../../../hooks/useResponsive';
import { setTransferDialogBoxVisibility } from '../../../redux/slices/products/machine';
import IconPopover from '../Icons/IconPopover';
import IconTooltip from '../Icons/IconTooltip';

export default function ViewFormEditDeleteButtons({
  isSuperAdmin=false,
  disableTransferButton = false,
  onDelete,
  handleEdit,
  handleTransfer,
  handleUpdatePassword,
  handleAWSInvite,
  sites,
  mainSite,
  handleMap,
}) {
  const { id } = useParams();
  const userId = localStorage.getItem('userId');
  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const { isLoading, transferDialogBoxVisibility } = useSelector((state) => state.machine);
  
  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);

  const [openAWSInviteConfirm, setOpenAWSInviteConfirm] = useState(false);
  const theme = createTheme({
    palette: {
      success: green,
    },
  });

  const disableDelete = userRoles.some((role) => role?.disableDelete === true);

  const handleOpenConfirm = (dialogType) => {
    if (dialogType === 'AWSInvite' && !isSuperAdmin) {
      setOpenAWSInviteConfirm(true);
    }
    if (dialogType === 'delete' && !isSuperAdmin) {
      setOpenConfirm(true);
    }
    if (dialogType === 'transfer') {
      dispatch(setTransferDialogBoxVisibility(true));
    }
  };

  const handleCloseConfirm = (dialogType) => {
    if (dialogType === 'AWSInvite') {
      reset();
      setOpenAWSInviteConfirm(false);
    }
    if (dialogType === 'delete') {
      reset();
      setOpenConfirm(false);
    }
    if (dialogType === 'transfer') {
      dispatch(setTransferDialogBoxVisibility(false));
    }
  };

  const handleAWSInviteConfirm = () => {
    handleAWSInvite();
  };

  const { isMobile } = useResponsive('down', 'sm');
  const methods = useForm();

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = methods;

  return (
    <>
      <StyledStack>
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

        {/* AWS Invitation */}
        {handleAWSInvite && (
          <IconTooltip 
          title="Invite AWS"
          disabled={isSuperAdmin}
          color={theme.palette.secondary.main}
          icon="mdi:aws"
          onClick={() => {
            handleOpenConfirm('AWSInvite');
          }}

          />
        )}

        {/* change password for users */}
        {handleUpdatePassword && (
          <IconTooltip
            title="Change Password"
            disabled={isSuperAdmin}
            onClick={() => {
              handleUpdatePassword();
            }}
            color={theme.palette.secondary.main}
            icon="mdi:account-key"
          />
        )}

        {/* edit button */}
        <IconTooltip
          title="Edit"
          disabled={isSuperAdmin}
          onClick={() => {
            handleEdit();
          }}
          color={theme.palette.primary.main}
          icon="mdi:pencil"
        />

        {/* delete button */}
        {id !== userId  && !mainSite && onDelete && (
          <IconTooltip
            title="Delete"
            disabled={!isSuperAdmin && disableDelete}
            onClick={() => {
              handleOpenConfirm('delete');
            }}
            color={theme.palette.error.light}
            icon="mdi:trash-can-outline"
          />
        )}
      </StyledStack>


      <ConfirmDialog
        open={openAWSInviteConfirm}
        onClose={() => {
          handleCloseConfirm('AWSInvite');
        }}
        title="AWS Invitation"
        content="Are you sure you want send AWS Invitation?"
        action={
          <LoadingButton
            variant="contained"
            color="primary"
            loading={(isSubmitSuccessful || isSubmitting) && isLoading}
            disabled={isSubmitting}
            onClick={handleSubmit(handleAWSInviteConfirm)}
          >
            Send
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
    </>
  );
}

ViewFormEditDeleteButtons.propTypes = {
  handleTransfer: PropTypes.func,
  handleUpdatePassword: PropTypes.func,
  handleAWSInvite: PropTypes.func,
  handleEdit: PropTypes.func,
  onDelete: PropTypes.func,
  sites: PropTypes.bool,
  mainSite: PropTypes.bool,
  isSuperAdmin:PropTypes.bool,
  disableTransferButton: PropTypes.bool,
  handleMap: PropTypes.func,
};
