import PropTypes from 'prop-types';
import { useState } from 'react';
import {  IconButton , Button} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import ConfirmDialog from '../../components/confirm-dialog';
import Iconify from '../../components/iconify';

DeleteIconButton.propTypes = {
    onClick: PropTypes.func,
  };
export default function DeleteIconButton({onClick}) {

    const [openConfirm, setOpenConfirm] = useState(false);
    const handleOpenConfirm = () => {
          setOpenConfirm(true);
      };
      const handleCloseConfirm = () => {
          setOpenConfirm(false);
      };

    return (
        <>
        <IconButton
        size="small"
        onClick={handleOpenConfirm}
        sx={{
          top: 4,
          left: 44,
          zIndex: 9,
          height: "60",
          position: 'absolute',
          color: (theme) => alpha(theme.palette.common.white, 0.8),
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.error.dark, 0.98),
          },
        }}
      >
        <Iconify icon="material-symbols:delete" width={18} />
      </IconButton>
      <ConfirmDialog
        open={openConfirm}
        onClose={() => {
          handleCloseConfirm();
        }}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onClick}>
            Delete
          </Button>
        }
      />
        </>
    )
}