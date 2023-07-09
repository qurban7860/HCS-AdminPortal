import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import ConfirmDialog from '../../../components/confirm-dialog';
import { FORMLABELS, BUTTONS } from '../../../constants/default-constants';

DefaultConfirmDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

function DefaultConfirmDialog({ open, onClose }) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <ConfirmDialog
      open={openDialog}
      onClose={handleCloseDialog}
      title={FORMLABELS.DIALOGS.DELETE.title}
      content={FORMLABELS.DIALOGS.DELETE.content}
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            setOpenDialog(true);
            onClose();
          }}
        >
          {BUTTONS.DELETE}
        </Button>
      }
    />
  );
}

export default DefaultConfirmDialog;
