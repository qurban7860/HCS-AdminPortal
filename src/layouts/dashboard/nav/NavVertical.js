import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { Box, Stack, Drawer,Typography, Link } from '@mui/material'
// hooks
// import { useSettingsContext } from '../../../components/settings';
import useResponsive from '../../../hooks/useResponsive';
// config
import { CONFIG, NAV  } from '../../../config-global';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import { NavSectionVertical } from '../../../components/nav-section';
//
import NavigationConfig from './NavigationConfig';
import NavDocs from './NavDocs';
import NavAccount from './NavAccount';
import NavToggleButton from './NavToggleButton';
import { PATH_SETTING } from '../../../routes/paths';

// ----------------------------------------------------------------------

NavVertical.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function NavVertical({ openNav, onCloseNav }) {
  
  const navConfig = NavigationConfig();

  const { pathname } = useLocation();
  // const { themeLayout } = useSettingsContext();
  const isDesktop = useResponsive('up', 'lg');
  const [envColor, setEnvColor]= useState('#897A69');
  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (CONFIG.ENV.toLocaleLowerCase() === 'dev' || CONFIG.ENV.toLocaleLowerCase === 'development' ) {
      setEnvColor('green');
    }else if(CONFIG.ENV.toLocaleLowerCase() === 'test' ) {
      
      setEnvColor('#4082ed');
    }
  }, []);

  
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
        <Logo sx={{ width: '70%', margin: '0 auto' }} />
        {/* <Grid sx={{ margin: '0 auto', mb:2, display:'flex', alignItems:'baseline'}}>
          {CONFIG.ENV.toLocaleLowerCase()!=='live' &&
            <Typography sx={{background:envColor, borderRadius:'50px', fontSize:'10px', padding:'2px 5px', color:"#FFF"}}>{`${CONFIG.ENV.toLocaleUpperCase()} ${CONFIG.Version}`}</Typography>
          }

          {CONFIG.ENV.toLocaleLowerCase()==='live' &&
            <Typography sx={{ color: '#897A69', fontSize:'10px'}}>{CONFIG.Version}</Typography>
          }
        </Grid> */}

        <Link
          sx={{ margin: '0 auto', mb: 2, display: 'flex', alignItems: 'baseline', textDecoration: 'none' }}
          href={PATH_SETTING.releases.list}
        >
          {CONFIG.ENV.toLocaleLowerCase() !== 'live' && ( <Typography sx={{ background: envColor, borderRadius: '50px', fontSize: '10px', padding: '2px 5px', color: '#FFF', }} > 
                  {`${CONFIG.ENV.toLocaleUpperCase()} ${CONFIG.Version}`} </Typography> )}
          {CONFIG.ENV.toLocaleLowerCase() === 'live' && ( <Typography sx={{ color: '#897A69', fontSize: '10px' }}> {CONFIG.Version} </Typography> )}
        </Link>

        <NavAccount />
      </Stack>
      <NavSectionVertical sx={{ mt: '-50px' }} data={navConfig} />
      <Box sx={{ flexGrow: 1 }} />
      <NavDocs />
    </Scrollbar>
  );
  return (
    <Box component="nav" sx={{ flexShrink: { lg: 0 }, width: { lg: NAV.W_DASHBOARD }}}>
      <NavToggleButton sx={{top: 22}}/>
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
