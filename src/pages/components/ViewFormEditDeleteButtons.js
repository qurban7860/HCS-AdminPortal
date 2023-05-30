import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
// eslint-disable-next-line
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { Button, Grid, Stack, Link, Tooltip, Typography, Popover, IconButton } from '@mui/material';
import ConfirmDialog from '../../components/confirm-dialog';
import Iconify from '../../components/iconify';
import useResponsive from '../../hooks/useResponsive';

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
  handleEdit: PropTypes.func,
  onDelete: PropTypes.func,
  type: PropTypes.string,
  sites: PropTypes.bool,
  handleMap: PropTypes.func,
};
export default function ViewFormEditDeleteButtons({
  onDelete,
  handleEdit,
  handleTransfer,
  type,
  sites,
  handleMap,
}) {
  const classes = useStyles();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
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
            onClick={() => {
              handleTransfer();
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
              handleOpenConfirm();
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
