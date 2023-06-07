import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
// eslint-disable-next-line
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Button, Grid, Stack, Link, Tooltip, Typography, Popover, IconButton } from '@mui/material';
import ConfirmDialog from '../../components/confirm-dialog';
import Iconify from '../../components/iconify';
import useResponsive from '../../hooks/useResponsive';
import { setTransferDialogBoxVisibility } from '../../redux/slices/products/machine';

const useStyles = makeStyles((theme) => ({
  tooltip: {
    fontSize: '1rem',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  tooltipError: {
    fontSize: '1rem',
    backgroundColor: theme.palette.error.main,
    color: 'white',
  },
}));

ViewFormEditDeleteButtons.propTypes = {
  handleTransfer: PropTypes.func,
  handleUpdatePassword: PropTypes.func,
  handleEdit: PropTypes.func,
  onDelete: PropTypes.func,
  type: PropTypes.string,
  sites: PropTypes.bool,
  disableButton: PropTypes.bool, 
  handleMap: PropTypes.func,
};
export default function ViewFormEditDeleteButtons({
  disableButton,
  onDelete,
  handleEdit,
  handleTransfer,
  handleUpdatePassword,
  type,
  sites,
  handleMap,
}) {
  const { isLoading, transferDialogBoxVisibility } = useSelector((state) => state.machine);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);
  // const [openTransferConfirm, setOpenTransferConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const handleOpenConfirm = (dialogType) => {
    if(dialogType === 'delete'){
      setOpenConfirm(true);
    }
    if(dialogType === 'transfer'){
      dispatch(setTransferDialogBoxVisibility(true));
    }
  };
  const handleCloseConfirm = (dialogType) => {
    if(dialogType === 'delete'){
      setOpenConfirm(false);
    }
    if(dialogType === 'transfer'){
      dispatch(setTransferDialogBoxVisibility(false));
    }
  };
  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setIsPopoverOpen(true);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
    setIsPopoverOpen(false);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const { isMobile } = useResponsive('down', 'sm');
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
        {sites && !isMobile ? (
          <Button
            onClick={() => {
              handleMap();
            }}
            sx={{ display: { sm: 'block', md: 'none' } }}
          >
            <IconButton
              aria-label="google-maps"
              onClick={handlePopoverOpen}
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <Iconify
                heading="Opem Map"
                icon="mdi:google-maps"
                style={{ color: 'red' }}
                width="30px"
              />
            </IconButton>
            <Popover
              open={isPopoverOpen}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'right',
              }}
              id="mouse-over-popover"
              sx={{
                '& .MuiPaper-root': {
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                },
                boxShadow: 'none',
                pointerEvents: 'none',
              }}
            >
              <Typography variant="overline" classes={{ root: classes.activeHover }} color="red">
                Open MAP
              </Typography>
            </Popover>
          </Button>
        ) : (
          ''
        )}

        {handleTransfer ? (
          <Button
            disabled={disableButton}
            onClick={() => {
              handleOpenConfirm('transfer');
            }}
            variant="outlined"
            title="Transfer"
          >
            <Tooltip
              title="Transfer Ownership"
              placement="top"
              disableFocusListener
              classes={{ tooltip: classes.tooltip }}
            >
              <Iconify sx={{ height: '24px', width: '24px' }} icon="mdi-cog-transfer-outline" />
            </Tooltip>
          </Button>
        ) : (
          ''
        )}


        {handleUpdatePassword ? (
          <Button
              onClick={() => {
              handleUpdatePassword();
            }}
            variant="outlined"
            title="Change Password"
          >
            <Tooltip
              title="Change Password"
              placement="top"
              disableFocusListener
              classes={{ tooltip: classes.tooltip }}
            >
              <Iconify sx={{ height: '24px', width: '24px' }} icon="mdi:account-key" />
            </Tooltip>
          </Button>
          ) : ( '' )
        }

        <Button
            onClick={() => {
            handleEdit();
          }}
          variant="outlined"
          title="Edit"
        >
          <Tooltip
            title="Edit"
            placement="top"
            disableFocusListener
            classes={{ tooltip: classes.tooltip }}
          >
            <Iconify sx={{ height: '24px', width: '24px' }} icon="mdi:pencil" />
          </Tooltip>
        </Button>
        {/* if not in the profile show this */}
        {onDelete ? (
          <Button
              onClick={() => {
              handleOpenConfirm('delete');
            }}
            variant="outlined"
            color="error"
            title="Delete"
          >
            <Tooltip
              title="Delete"
              placement="top"
              disableFocusListener
              classes={{ tooltip: classes.tooltipError }}
              color="error"
            >
              <Iconify sx={{ height: '24px', width: '24px' }} icon="mdi:trash-can-outline" />
            </Tooltip>
          </Button>
        ) : (
          ''
        )}
      </Stack>
      <ConfirmDialog
        open={openConfirm}
        onClose={() => {
          handleCloseConfirm('delete');
        }}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
        }
      />
      <ConfirmDialog
        open={transferDialogBoxVisibility}
        onClose={() => {
          handleCloseConfirm('transfer');
        }}
        title="Ownership Transfer"
        content="Are you sure you want to transfer machine ownership?"
        action={
          <LoadingButton
            color="error"
            variant="contained"
            loading={isLoading}
            onClick={handleTransfer}
          >
            Transfer
          </LoadingButton>
        }
      />
    </>
  );
}
