/* eslint-disable react/no-danger */
import {
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Fade,
  Grid,
  Card,
  Divider
} from '@mui/material';
import { useState } from 'react';
import PropTypes from 'prop-types';

export default function ChipDialog({ label, title, children, onDelete }) {
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  return (
    <>
      <Chip label={label} onClick={handleOpenDialog} onDelete={onDelete} />
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        TransitionComponent={Fade}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle variant="h3" sx={{ pb: 1, pt: 2 }}>{title}</DialogTitle>
        <Divider orientation="horizontal" flexItem />
        <DialogContent sx={{mt: 1}}>
          <Card sx={{ p: 2 }}>
          <Grid container>
            {typeof children === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: children }} />
            ) : (
              children
            )}
          </Grid>
          </Card>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

ChipDialog.propTypes = {
  label: PropTypes.string.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onDelete: PropTypes.func,
};