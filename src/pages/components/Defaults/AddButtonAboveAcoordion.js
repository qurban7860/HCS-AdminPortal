import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Stack } from '@mui/material';
import Iconify from '../../../components/iconify';
import ConfirmDialog from '../../../components/confirm-dialog';
import useResponsive from '../../../hooks/useResponsive';
import { BUTTONS, DIALOGS } from '../../../constants/default-constants';

export default function AddButtonAboveAccordion({
  name,
  toggleChecked,
  FormVisibility,
  toggleCancel,
  isCustomer,
  disabled,
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
        fullWidth={isMobile}
        disabled={disabled}
        variant="contained"
        color={!FormVisibility ? 'primary' : 'error'}
        startIcon={
          !FormVisibility ? <Iconify icon="eva:plus-fill" /> : <Iconify icon="eva:minus-fill" />
        }
        sx={{
          mb: { xs: 0, md: 2 },
          my: { xs: 1 },
          ...(isMobile && { width: '100%' }),
          opacity: isCustomer ? 0 : 1,
          display: isCustomer && isMobile ? 'none' : 'flex',
        }}
      >
        {!FormVisibility ? name : 'Close Add'}
      </Button>
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title={DIALOGS.DISCARD_TITLE}
        content={DIALOGS.DISCARD}
        action={
          <Button variant="contained" color="error" onClick={onConfirm}>
            {BUTTONS.DISCARD}
          </Button>
        }
        SubButton={BUTTONS.CONTINUE}
      />
    </>
  );
}

AddButtonAboveAccordion.propTypes = {
  name: PropTypes.string,
  FormVisibility: PropTypes.bool,
  toggleChecked: PropTypes.func,
  toggleCancel: PropTypes.func,
  isCustomer: PropTypes.bool,
  disabled: PropTypes.bool,
};
