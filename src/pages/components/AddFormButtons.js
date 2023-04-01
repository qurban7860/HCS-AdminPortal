import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { Box, Button, Card, Grid, Stack, Typography, DialogTitle, Dialog, InputAdornment,TextField } from '@mui/material';
import ConfirmDialog from '../../components/confirm-dialog';

AddFormButtons.propTypes = {
  saveButtonName: PropTypes.string,
  cancelButtonName: PropTypes.string,
  toggleCancel: PropTypes.func,
  isSubmitting: PropTypes.bool,
  };

export default function AddFormButtons({saveButtonName,toggleCancel,isSubmitting,cancelButtonName}) {
const [openConfirm, setOpenConfirm] = useState(false);

const handleOpenConfirm = () => {
  setOpenConfirm(true);
};

const handleCloseConfirm = () => {
  setOpenConfirm(false);
  // toggleCancel();
};
const onConfirm = () => {
  setOpenConfirm(false);
  toggleCancel();
}
    return (
      <>
        <Stack justifyContent="flex-end" direction="row" spacing={2} >
          <Grid item md={4} sm={6} xs={12} >
                  <Stack justifyContent="flex-end" direction="row" spacing={2} >
                      <Grid item  sm={6} >
                        <LoadingButton type="submit" variant="contained" size="large" fullWidth loading={isSubmitting}>
                          {saveButtonName || "Save"}
                        </LoadingButton>
                      </Grid>
                      <Grid item  sm={6} >
                        <Button 
                          onClick={handleOpenConfirm}
                          fullWidth
                          variant="outlined" 
                          size="large">
                            {cancelButtonName  || "Cancel"}
                        </Button>
                      </Grid>
                  </Stack>
          </Grid>
        </Stack>

        <ConfirmDialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            title="Cancle"
            content="Are you sure want to discard data?"
            action={
              <Button variant="contained" color="error" onClick={onConfirm}>
                Confirm
              </Button>
              
            }
          />
         
      </>
    )
}