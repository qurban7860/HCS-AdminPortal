import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Stack } from '@mui/material';
import Iconify from '../../components/iconify';
import ConfirmDialog from '../../components/confirm-dialog';
import useResponsive from '../../hooks/useResponsive';

export default function AddButtonAboveAccordion({
  name,
  toggleChecked,
  FormVisibility,
  toggleCancel,
}) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const isMobile = useResponsive('down', 'sm');
  const handleOpenConfirm = () => {
    if (FormVisibility) {
      setOpenConfirm(true);
    } else {
      toggleChecked();
    }
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    // toggleCancel();
  };
  const onConfirm = () => {
    setOpenConfirm(false);
    toggleCancel();
  };
  return (
    <>
      <Button
        onClick={handleOpenConfirm}
        variant="contained"
        color={!FormVisibility ? 'primary' : 'error'}
        startIcon={
          !FormVisibility ? <Iconify icon="eva:plus-fill" /> : <Iconify icon="eva:minus-fill" />
        }
        sx={{ mb: 3, ...(isMobile && { width: '100%' }) }}
      >
        {!FormVisibility ? name : 'Close Add'}
      </Button>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Cancel"
        content="Are you sure you want to cancel?"
        action={
          <Button variant="contained" color="error" onClick={onConfirm}>
            Confirm
          </Button>
        }
      />
    </>
  );
}

AddButtonAboveAccordion.propTypes = {
  name: PropTypes.string,
  FormVisibility: PropTypes.bool,
  toggleChecked: PropTypes.func,
  toggleCancel: PropTypes.func,
};
