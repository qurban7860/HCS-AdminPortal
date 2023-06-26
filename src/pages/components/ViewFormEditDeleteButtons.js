import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
// eslint-disable-next-line
import { makeStyles } from '@mui/styles'; // will uninstall this later
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Stack, Typography, Popover, IconButton } from '@mui/material';
import { green } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StyledTooltip } from '../../theme/styles/default-styles';
import ConfirmDialog from '../../components/confirm-dialog';
import Iconify from '../../components/iconify';
import useResponsive from '../../hooks/useResponsive';
import { setTransferDialogBoxVisibility } from '../../redux/slices/products/machine';

ViewFormEditDeleteButtons.propTypes = {
  handleVerification: PropTypes.func,
  isVerified: PropTypes.bool,
  handleTransfer: PropTypes.func,
  handleUpdatePassword: PropTypes.func,
  handleEdit: PropTypes.func,
  onDelete: PropTypes.func,
  type: PropTypes.string,
  sites: PropTypes.bool,
  disableTransferButton: PropTypes.bool,
  disablePasswordButton: PropTypes.bool,
  disableDeleteButton: PropTypes.bool,
  disableEditButton: PropTypes.bool,
  handleMap: PropTypes.func,
};
export default function ViewFormEditDeleteButtons({
  disableTransferButton = false,
  disableDeleteButton = false,
  disablePasswordButton = false,
  disableEditButton = false,
  isVerified,
  handleVerification,
  onDelete,
  handleEdit,
  handleTransfer,
  handleUpdatePassword,
  type,
  sites,
  handleMap,
}) {
  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const { isLoading, transferDialogBoxVisibility } = useSelector((state) => state.machine);
  const dispatch = useDispatch();
  const [openConfirm, setOpenConfirm] = useState(false);

  const [openVerificationConfirm, setOpenVerificationConfirm] = useState(false);
  const theme = createTheme({
    palette: {
      success: green,
    },
  });
  // const [openTransferConfirm, setOpenTransferConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [deleteButtonColor, setDeleteButtonColor] = useState('error.main');
  const [deleteButtonHoverColor, setDeleteButtonHoverColor] = useState('error.dark');

  const disableDelete = userRoles.some((role) => role?.disableDelete === true);
  useEffect(() => {
    if (disableDelete) {
      setDeleteButtonColor('text.secondary');
      setDeleteButtonHoverColor('text.secondary.dark');
    }
  }, [disableDelete]);

  if (disableDelete) {
    disableDeleteButton = true;
  } else {
    disableDeleteButton = false;
  }

  const handleOpenConfirm = (dialogType) => {
    if (dialogType === 'Verification' && !isVerified) {
      setOpenVerificationConfirm(true);
    }
    if (dialogType === 'delete' && !disableDeleteButton) {
      setOpenConfirm(true);
    }
    if (dialogType === 'transfer') {
      dispatch(setTransferDialogBoxVisibility(true));
    }
  };
  const handleCloseConfirm = (dialogType) => {
    if (dialogType === 'Verification') {
      reset();
      setOpenVerificationConfirm(false);
    }
    if (dialogType === 'delete') {
      reset();
      setOpenConfirm(false);
    }
    if (dialogType === 'transfer') {
      dispatch(setTransferDialogBoxVisibility(false));
    }
  };

  const handleVerificationConfirm = () => {
    handleVerification();
    handleCloseConfirm('Verification');
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

  const methods = useForm();

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;
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
        {handleVerification && !isVerified && (
          <ThemeProvider theme={theme}>
            <Button
              onClick={() => {
                handleOpenConfirm('Verification');
              }}
              variant="outlined"
              color={isVerified ? 'success' : 'primary'}
              sx={{ position: 'relative', zIndex: '1' }}
            >
              <StyledTooltip
                title={isVerified ? 'Verified' : 'Verify'}
                placement="top"
                disableFocusListener
                toolTipColor={isVerified ? theme.palette.primary.main : theme.palette.primary.main}
              >
                <Iconify sx={{ height: '24px', width: '24px' }} icon="ic:round-verified-user" />
              </StyledTooltip>
            </Button>
          </ThemeProvider>
        )}

        {/* map icon sliding tooltip *no bg */}
        {sites && !isMobile && (
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
                heading="Open Map"
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
              <Typography variant="overline" color="red">
                Open MAP
              </Typography>
            </Popover>
          </Button>
        )}

        {/* machine transfer */}
        {handleTransfer && (
          <Button
            disabled={disableTransferButton}
            onClick={() => {
              handleOpenConfirm('transfer');
            }}
            variant="outlined"
          >
            <StyledTooltip
              title="Transfer Ownership"
              placement="top"
              disableFocusListener
              toolTipColor={theme.palette.primary.main}
            >
              <Iconify sx={{ height: '24px', width: '24px' }} icon="mdi-cog-transfer-outline" />
            </StyledTooltip>
          </Button>
        )}

        {/* change password for users */}
        {handleUpdatePassword && (
          <Button
            disabled={disablePasswordButton}
            onClick={() => {
              handleUpdatePassword();
            }}
            variant="outlined"
          >
            <StyledTooltip
              title="Change Password"
              placement="top"
              disableFocusListener
              toolTipColor={theme.palette.secondary.main}
            >
              <Iconify sx={{ height: '24px', width: '24px' }} icon="mdi:account-key" />
            </StyledTooltip>
          </Button>
        )}
        {/* edit button */}
        <Button
          disabled={disableEditButton}
          onClick={() => {
            handleEdit();
          }}
          variant="outlined"
        >
          <StyledTooltip
            title="Edit"
            placement="top"
            disableFocusListener
            toolTipColor={theme.palette.primary.main}
          >
            <Iconify sx={{ height: '24px', width: '24px' }} icon="mdi:pencil" />
          </StyledTooltip>
        </Button>

        {/* delete button */}
        {onDelete && (
          <Button
            // disabled={disableDeleteButton}
            // readOnly={disableDeleteButton}
            onClick={() => {
              handleOpenConfirm('delete');
            }}
            variant="outlined"
            sx={{
              color: deleteButtonColor,
              borderColor: deleteButtonColor,
              ':hover': {
                borderColor: deleteButtonHoverColor,
              },
            }}
            // color={disableDeleteButton ? 'secondary' :'error'}
          >
            <StyledTooltip
              title="Delete"
              placement="top"
              disableFocusListener
              toolTipColor="red"
              color="error"
            >
              <Iconify sx={{ height: '24px', width: '24px' }} icon="mdi:trash-can-outline" />
            </StyledTooltip>
          </Button>
        )}
      </Stack>
      <ConfirmDialog
        open={openVerificationConfirm}
        onClose={() => {
          handleCloseConfirm('Verification');
        }}
        title="Verification"
        content="Are you sure you want to Verify Machine Informaton?"
        action={
          <LoadingButton
            variant="contained"
            color="primary"
            loading={(isSubmitSuccessful || isSubmitting) && isLoading}
            disabled={isSubmitting}
            onClick={handleSubmit(handleVerificationConfirm)}
            // onClick={()=> {handleVerification(); handleCloseConfirm('Verification');}}
          >
            Verify
          </LoadingButton>
        }
      />
      <ConfirmDialog
        open={openConfirm}
        onClose={() => {
          handleCloseConfirm('delete');
        }}
        title="Delete"
        content="Are you sure you want to delete?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={(isSubmitSuccessful || isSubmitting) && isLoading}
            disabled={isSubmitting}
            onClick={handleSubmit(onDelete)}
          >
            Delete
          </LoadingButton>
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
