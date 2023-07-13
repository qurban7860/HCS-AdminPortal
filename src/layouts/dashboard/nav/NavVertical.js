import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { Box, Stack, Drawer, Slide , Typography, Grid} from '@mui/material'
// hooks
import { useSettingsContext } from '../../../components/settings';
import useResponsive from '../../../hooks/useResponsive';
// config
import { CONFIG, NAV  } from '../../../config-global';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import { NavSectionVertical } from '../../../components/nav-section';
//
import navConfig from './config-navigation';
import NavDocs from './NavDocs';
import NavAccount from './NavAccount';
import NavToggleButton from './NavToggleButton';

// ----------------------------------------------------------------------

NavVertical.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function NavVertical({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const { themeLayout } = useSettingsContext();
  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      >
      <Stack
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
        }}
      >
        <Logo sx={{ width: '70%', margin: '0 auto', mt: '-30px' }} />
        <Grid sx={{ margin: '0 auto', mt: -2, mb: 1 }}>
          <Typography
              // variant="body2"
              sx={{ margin: '0 auto', mt: -1, mb: 3, color: '#897A69', fontSize:'10px' }}
              >
           {CONFIG.Version}
          </Typography>
        </Grid>
        <NavAccount />
      </Stack>

      <NavSectionVertical sx={{ mt: '-50px' }} data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />

      <NavDocs />
    </Scrollbar>
  );
      // console.log({ themeLayout, isDesktop })
  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_DASHBOARD },
        // background: '#DFDFDF',
      }}
    >
      <NavToggleButton
        sx={{
          top: 22
        }}
      />

      {isDesktop ? (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              zIndex: 0,
              width: NAV.W_DASHBOARD,
              bgcolor: 'transparent',
              borderRightStyle: 'solid',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV.W_DASHBOARD,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
