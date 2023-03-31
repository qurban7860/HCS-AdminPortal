import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { Button, Grid, Stack } from '@mui/material';
import ConfirmDialog from '../../components/confirm-dialog';
import Iconify from '../../components/iconify';

ViewFormEditDeleteButtons.propTypes = {
  handleEdit: PropTypes.object,
  onDelete: PropTypes.object,
  };
export default function ViewFormEditDeleteButtons({onDelete,handleEdit}) {
const [openConfirm, setOpenConfirm] = useState(false);
const [openPopover, setOpenPopover] = useState(null);
const handleOpenConfirm = () => {
  setOpenConfirm(true);
};
const handleCloseConfirm = () => {
  setOpenConfirm(false);
};
    return (
      <>
        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mb: -4, mt:-2, mr:3}}>
              <Button
                onClick={() => handleEdit()}
                variant="outlined"
                startIcon={<Iconify icon="eva:edit-fill" />}
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  handleOpenConfirm();
                }}
                variant="outlined"
                color="error"
                startIcon={<Iconify icon="eva:trash-2-fill" />}
              >
                Delete
              </Button>
          </Stack>
          <ConfirmDialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            title="Delete"
            content="Are you sure want to delete?"
            action={
              <Button variant="contained" color="error" onClick={onDelete}>
                Delete
              </Button>
            }
          />
      </>
    )
}