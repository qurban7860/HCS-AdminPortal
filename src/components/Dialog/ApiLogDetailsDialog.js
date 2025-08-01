import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider } from '@mui/material';
import CodeMirror from '../CodeMirror/JsonEditor'; 

function ApiLogDetailsDialog({ open, onClose, logDetails }) {
  if (logDetails.response) {
    try {
      logDetails.response = JSON.parse(logDetails.response);
    } catch (error) {
      // Do nothing
    }
  }
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" aria-labelledby="api-log-dialog-title" aria-describedby="api-log-dialog-description" fullWidth>
      <DialogTitle variant="h3" sx={{ pb: 1, pt: 2 }}>API Log Details</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{ px: 3, pt: 2 }}>
        <CodeMirror
          value={JSON.stringify(logDetails, null, 2)}  
          editable={false}
          disableTopBar
          autoHeight
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ApiLogDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  logDetails: PropTypes.object,
};

export default ApiLogDetailsDialog;
