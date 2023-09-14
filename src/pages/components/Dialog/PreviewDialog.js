import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, Box } from '@mui/material';
import DialogLabel from './DialogLabel';

PreviewDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  content: PropTypes.string,
  src: PropTypes.string,
  defaultValues: PropTypes.object,
};

export default function PreviewDialog({ open, onClose, content, src, defaultValues }) {
  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={onClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <DialogLabel content={content} onClick={onClose} />
      <Box
        component="img"
        sx={{ minWidth: '400px', minHeight: '400px' }}
        alt={defaultValues?.name}
        src={src}
      />
    </Dialog>
  );
}
