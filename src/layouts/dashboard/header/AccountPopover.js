import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Divider,
  Drawer,
  Typography,
  Stack,
  Tooltip,
  MenuItem,
  IconButton,
} from '@mui/material';
// routes
import { NAV } from '../../../config-global';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import { CustomAvatar } from '../../../components/custom-avatar';
import { useSnackbar } from '../../../components/snackbar';
import MenuPopover from '../../../components/menu-popover';
import { IconButtonAnimate } from '../../../components/animate';
// import Drawer
import SettingsDrawer from '../../../components/settings/drawer';
import LayoutOptions from '../../../components/settings/drawer/LayoutOptions';
import Block from '../../../components/settings/drawer/Block';
import ModeOptions from '../../../components/settings/drawer/ModeOptions';
import ContrastOptions from '../../../components/settings/drawer/ContrastOptions';
import DirectionOptions from '../../../components/settings/drawer/DirectionOptions';
import StretchOptions from '../../../components/settings/drawer/StretchOptions';
import ColorPresetsOptions from '../../../components/settings/drawer/ColorPresetsOptions';
import FullScreenOptions from '../../../components/settings/drawer/FullScreenOptions';
import { bgBlur } from '../../../utils/cssStyles';
import { useSettingsContext } from '../../../components/settings';
import { defaultSettings } from '../../../components/settings/config-setting';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import { TITLES } from '../../../constants/default-constants';
import { OPTIONS } from './util/OptionsListItems';
import { setChangePasswordDialog } from '../../../redux/slices/securityUser/securityUser';
import ChangePasswordDialog from '../../../components/Dialog/ChangePasswordDialog';

// ----------------------------------------------------------------------
const SPACING = 2.5;

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, logout } = useAuthContext();
  const email = localStorage.getItem('email')
  const displayName = localStorage.getItem('name')
  const { enqueueSnackbar } = useSnackbar();
  const [openPopover, setOpenPopover] = useState(null);
  const { onChangeDrawer } = useSettingsContext();
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleChangePassword = () => {
    dispatch(setChangePasswordDialog(true));
  };

  const handleLogout = async () => {
    try {
      logout();
      handleClosePopover();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const handleToggle = () => {
    handleClosePopover();
  };

  const handleClickItem = (path) => {
    handleClosePopover();
    if( typeof path === 'function' && user?.customer ){
      navigate(path(user?.customer));
    } else if( typeof path === 'string' ) {
      navigate(path);
    }
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpenPopover}
        sx={{
          p: 0,
          ...(openPopover && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              // bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <CustomAvatar src={user?.photoURL} alt={user?.displayName} name={user?.displayName} />
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 200, p: 0 }}>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName || displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.login || email }
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: 'solid' }} />
        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
          <MenuItem onClick={() => { 
              handleToggle(); 
              onChangeDrawer(); 
            }} 
          >
            <Typography variant="body2" noWrap>{TITLES.CUSTOMIZE}</Typography>
          </MenuItem>
        </Stack>

        <Divider sx={{ borderStyle: 'solid' }} />
        <Stack sx={{ p: 1 }}>
          <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>
          <MenuItem onClick={handleLogout}>{TITLES.LOGOUT}</MenuItem>
        </Stack>
      </MenuPopover>
      <ChangePasswordDialog />
    </>
  );
}
