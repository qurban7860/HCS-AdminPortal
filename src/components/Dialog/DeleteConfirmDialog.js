import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import ConfirmDialog from '../confirm-dialog';
import { DIALOGS, BUTTONS } from '../../constants/default-constants';

DeleteConfirmDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  content: PropTypes.string
};

function DeleteConfirmDialog({ open, onClose, content }) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <ConfirmDialog
      open={openDialog}
      onClose={handleCloseDialog}
      title={DIALOGS.DELETE.title}
      content={content || DIALOGS.DELETE.content}
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

export default DeleteConfirmDialog;
