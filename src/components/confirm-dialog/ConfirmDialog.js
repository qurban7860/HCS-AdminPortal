import PropTypes from 'prop-types';
// @mui
import { Dialog, Button, DialogTitle, DialogActions, DialogContent, Divider } from '@mui/material';

// ----------------------------------------------------------------------

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.node,
  action: PropTypes.node,
  content: PropTypes.node,
  onClose: PropTypes.func,
  SubButton: PropTypes.node,
};

export default function ConfirmDialog({
  title,
  content,
  action,
  open,
  onClose,
  SubButton="Cancel",
  ...other
}) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle variant='h4' sx={{pb:1, pt:2}}>{title}</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      {content && <DialogContent sx={{ typography: 'body2', pt:2 }}> {content} </DialogContent>}
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>{SubButton}</Button>
        {action}
      </DialogActions>
    </Dialog>
  );
}
