import PropTypes from 'prop-types';
import { useState } from 'react';
import { IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { styled, alpha } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import ConfirmDialog from '../../components/confirm-dialog';
import Iconify from '../../components/iconify';

DeleteIconButton.propTypes = {
  onClick: PropTypes.func,
  left: PropTypes.number,
};

export default function DeleteIconButton({ onClick, left }) {

  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const disableDelete = userRoles.some(role => role?.disableDelete === true);

  const [openConfirm, setOpenConfirm] = useState(false);
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const methods = useForm();

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  return (
    <>{!disableDelete &&
      <IconButton
        // disabled={disableDelete}
        size="small"
        onClick={handleOpenConfirm}
        sx={{
          top: 4,
          left: { left },
          zIndex: 9,
          width: 28,
          height: 28,
          position: 'absolute',
          color: (theme) => alpha(theme.palette.common.white, 0.8),
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.error.dark, 0.98),
          },
        }}
        >
        <Iconify icon="material-symbols:delete" width={18} />
      </IconButton>}
      <ConfirmDialog
        open={openConfirm}
        onClose={() => {
          handleCloseConfirm();
        }}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={isSubmitSuccessful || isSubmitting}
            disabled={isSubmitting}
            onClick={handleSubmit(onClick)}
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
}