import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

// ----------------------------------------------------------------------
const SPACING = 2.5;

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const email = localStorage.getItem('email')
  const displayName = localStorage.getItem('name')

  const { enqueueSnackbar } = useSnackbar();

  const [openPopover, setOpenPopover] = useState(null);

  const {
    themeMode,
    themeLayout,
    themeStretch,
    themeContrast,
    themeDirection,
    themeColorPresets,
    onResetSetting,
  } = useSettingsContext();
  
  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
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

  // for settings drawer
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
    handleClosePopover();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickItem = (path) => {
    handleClosePopover();
    navigate(path || setOpen(!open));
  };

  const notDefault =
    themeMode !== defaultSettings.themeMode ||
    themeLayout !== defaultSettings.themeLayout ||
    themeStretch !== defaultSettings.themeStretch ||
    themeContrast !== defaultSettings.themeContrast ||
    themeDirection !== defaultSettings.themeDirection ||
    themeColorPresets !== defaultSettings.themeColorPresets;

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
          <MenuItem
            onClick={() => {
              handleToggle();
              SettingsDrawer();
            }}
            onClose={handleClose}
          >
            <Typography variant="body2" noWrap>
              {TITLES.CUSTOMIZE}
            </Typography>
          </MenuItem>
        </Stack>

        <Divider sx={{ borderStyle: 'solid' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          {TITLES.LOGOUT}
        </MenuItem>
      </MenuPopover>
      <>
        {!open && <Drawer open={open} notDefault={notDefault} onToggle={handleToggle} />}
        <Drawer
          anchor="left"
          open={open}
          onClose={handleClose}
          BackdropProps={{ invisible: true }}
          PaperProps={{
            sx: {
              ...bgBlur({ color: theme.palette.background.default, opacity: 0.9 }),
              width: NAV.W_BASE,
              boxShadow: `-24px 12px 40px 0 ${alpha(
                theme.palette.mode === 'light'
                  ? theme.palette.grey[500]
                  : theme.palette.common.black,
                0.16
              )}`,
              ...(open && { '&:after': { position: 'relative', zIndex: 9999 } }),
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ py: 2, pr: 1, pl: SPACING }}
          >
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              {TITLES.SETTINGS}
            </Typography>

            <Tooltip title="Reset">
              <Box sx={{ position: 'relative' }}>
                <IconButton onClick={onResetSetting}>
                  <Iconify icon="ic:round-refresh" />
                </IconButton>
              </Box>
            </Tooltip>

            <IconButton onClick={handleClose}>
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Stack>

          <Divider sx={{ borderStyle: 'solid' }} />

          <Scrollbar sx={{ p: SPACING, pb: 0 }}>
            <Block title={TITLES.MODE}>
              <ModeOptions />
            </Block>

            <Block title={TITLES.CONTRAST}>
              <ContrastOptions />
            </Block>

            <Block title={TITLES.DIRECTION}>
              <DirectionOptions />
            </Block>

            <Block title={TITLES.LAYOUT}>
              <LayoutOptions />
            </Block>

            <Block title={TITLES.STRETCH.label} tooltip={TITLES.STRETCH.tooltip}>
              <StretchOptions />
            </Block>

            <Block title={TITLES.PRESETS}>
              <ColorPresetsOptions />
            </Block>
          </Scrollbar>

          <Box sx={{ p: SPACING, pt: 0 }}>
            <FullScreenOptions />
          </Box>
        </Drawer>
      </>
    </>
  );
}
