import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Stack, AppBar, Toolbar, IconButton, Box, Button, Link, Divider } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';

// hooks
import useOffSetTop from '../../../hooks/useOffSetTop';
import useResponsive from '../../../hooks/useResponsive';
// config
import { HEADER, NAV } from '../../../config-global';
// components
import TimeDisplay from '../../../components/timeZone/TimeZone';
import Logo from '../../../components/logo';
import FullScreenIcon from '../../../components/Icons/FullScreenIcon';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import { useWebSocketContext } from '../../../auth/WebSocketContext';
import { MAIN_CATEGORIES, getOtherMainCategories } from '../navigationConstants';
import { useAuthContext } from '../../../auth/useAuthContext';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import IconButtonTooltip from '../../../components/Icons/IconButtonTooltip';

// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
  selectedCategory: PropTypes.object,
  setSelectedCategory: PropTypes.func,
};

export default function Header({ onOpenNav, selectedCategory, setSelectedCategory }) {
  const theme = useTheme();
  const { themeLayout } = useSettingsContext();
  const isNavHorizontal = themeLayout === 'horizontal';
  const isNavMini = themeLayout === 'mini';
  const isDesktop = useResponsive('up', 'lg');
  const isOffset = useOffSetTop(HEADER.H_DASHBOARD_DESKTOP) && !isNavHorizontal;
  const { sendJsonMessage } = useWebSocketContext();
  const { isSettingAccessAllowed } = useAuthContext();
  const { user: currentUser } = useAuthContext();
  const otherCategories = useMemo(() => getOtherMainCategories(currentUser?.roles), [currentUser?.roles]);

  useEffect(() => {
    sendJsonMessage({ eventName: 'getNotifications' });
  }, [sendJsonMessage])


  const renderContent = (
    <>
      {isDesktop && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />}
      {!isDesktop && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1, color: 'text.primary' }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}
      {isDesktop && (
        <>
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {MAIN_CATEGORIES.map((item) => (
              <Link
                key={item.id}
                component={RouterLink}
                to={item.path}
                sx={{
                  my: 2,
                  mx: 0.5,
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit'
                }}
                onClick={() => setSelectedCategory(item)}
              >
                <Button
                  variant={item.id === selectedCategory.id ? "contained" : "text"}
                  sx={{ width: '100%', height: '100%' }}
                >
                  {item.title}
                </Button>
              </Link>
            ))}
          </Box>
          <Stack direction="row" alignItems="center" sx={{mr:1}}>
            <TimeDisplay/>
            {isDesktop && <FullScreenIcon />}
            <Divider orientation="vertical" flexItem />
            {otherCategories.map((item) => (
              <Link key={item.id} component={RouterLink} to={item.path} onClick={() => setSelectedCategory(item)}>
                <IconButtonTooltip 
                  icon={item.icon}
                  title={item.title}
                  color={selectedCategory.id === item.id ? '#1976d2' : '#808080'}
                  sx={{cursor: 'pointer'}} 
                />
              </Link>
            ))}
            <Divider orientation="vertical" flexItem />
          </Stack>
        </>
      )}
      <Stack
        flexGrow={!isDesktop ? 1 : 0}
        direction="row"
        alignItems="center"
        spacing={{ xs: 0.5, sm: 1.5 }}
        justifyContent={!isDesktop ? 'flex-end' : 'flex-start'}
      > 
      {!isDesktop && <TimeDisplay/>}
        <NotificationsPopover />
        <AccountPopover />
        
        
      </Stack>
    </>
  );
  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        position: 'fixed',
        top: 0,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: "#fff",
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(isDesktop && {
          width: `calc(100% - ${NAV.W_DASHBOARD + 1}px)`,
          height: HEADER.H_DASHBOARD_DESKTOP,
          ...(isOffset && {
            height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
          }),
          // ...(isNavHorizontal && {
          //   width: 1,
          //   bgcolor: 'background.default',
          //   height: HEADER.H_DASHBOARD_DESKTOP_OFFSET,
          //   borderBottom: `solid 1px ${theme.palette.divider}`,
          // }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_DASHBOARD_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar sx={{ height: 1, px: { lg: 5 }, color: 'text.primary', position: 'sticky' }} >{renderContent}</Toolbar>
    </AppBar>
  );
}
