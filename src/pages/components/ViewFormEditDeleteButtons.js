import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { Button, Grid, Stack,Link, Tooltip } from '@mui/material';
import ConfirmDialog from '../../components/confirm-dialog';
import Iconify from '../../components/iconify';

ViewFormEditDeleteButtons.propTypes = {
  handleEdit: PropTypes.func,
  onDelete: PropTypes.func,
  type: PropTypes.string,
  };
export default function ViewFormEditDeleteButtons({onDelete,handleEdit, type}) {
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
        <Stack
          justifyContent="flex-end"
          direction="row"
          spacing={2}
          sx={{
            mb: -5,
            // mt:1,
            mr: 3,
            '& .MuiButton-root': {
              minWidth: '32px',
              width: '32px',
              height: '32px',
              p: 0,
              '&:hover': {
                background: 'transparent',
              },
            },
          }}
        >
          <Button
            onClick={() => {
              handleEdit();
            }}
            variant="outlined"
            title="Edit"
            >
            <Tooltip title="Edit" placement="top" disableFocusListener>
              <Iconify sx={{ height: '24px', width: '24px' }} icon="mdi:pencil" />
            </Tooltip>
          </Button>
          {/* if not in the profile show this */}
          {onDelete ? (
            <Button
              onClick={() => {
                handleOpenConfirm();
              }}
              variant="outlined"
              color="error"
              title="Delete"
            >
              <Tooltip title="Delete" placement="top" disableFocusListener>
                <Iconify sx={{ height: '24px', width: '24px' }} icon="mdi:trash-can-outline" />
              </Tooltip>
            </Button>
          ) : (
            ''
          )}
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
    );
}