import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import { Stack, Box , Typography, Link } from '@mui/material';
// config
import { NAV, CONFIG } from '../../../config-global';
// utils
import { hideScrollbarX } from '../../../utils/cssStyles';
// components
import Logo from '../../../components/logo';
import { NavSectionMini } from '../../../components/nav-section';
//
import NavigationConfig from './NavigationConfig';
import NavToggleButton from './NavToggleButton';
import { PATH_SETTING } from '../../../routes/paths';
import { useAuthContext } from '../../../auth/useAuthContext';

// ----------------------------------------------------------------------

NavMini.propTypes = {
  selectedCategory: PropTypes.object,
};

export default function NavMini({selectedCategory}) {
  const [envColor, setEnvColor]= useState('#897A69');

  const {
    isDocumentAccessAllowed,
    isDrawingAccessAllowed,
    isSettingAccessAllowed,
    isSecurityUserAccessAllowed,
    isEmailAccessAllowed,
    isDeveloper,
  } = useAuthContext();

  const navConfig = NavigationConfig({
    selectedCategory,
    isDocumentAccessAllowed,
    isDrawingAccessAllowed,
    isSettingAccessAllowed,
    isSecurityUserAccessAllowed,
  });

  useEffect(() => {
    if (CONFIG.ENV.toLocaleLowerCase() === 'dev' || CONFIG.ENV.toLocaleLowerCase === 'development' ) {
      setEnvColor('green');
    }else if(CONFIG.ENV.toLocaleLowerCase() === 'test' ) {
      
      setEnvColor('#4082ed');
    }
  }, []);

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_DASHBOARD_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          top: 22,
          left: NAV.W_DASHBOARD_MINI - 12,
        }}
      />

      <Stack
        sx={{
          pb: 1,
          height: 1,
          position: 'fixed',
          width: NAV.W_DASHBOARD_MINI,
          borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
          ...hideScrollbarX,
        }}
      >
        <Logo
          src="/logo/HowickIcon.svg"
          sx={{ mx: 'auto', mt: 2, width: '50px', height: '50px' }}
        />
        <Link
          sx={{
            my: 1,
            mx: 'auto',
            display: 'flex',
            alignItems: 'baseline',
            textDecoration: 'none',
          }}
          href={PATH_SETTING.releases.list}
        >
          {CONFIG.ENV.toLocaleLowerCase() !== 'live' && (
            <Typography
              sx={{
                background: envColor,
                borderRadius: '50px',
                fontSize: '10px',
                padding: '2px 5px',
                color: '#FFF',
              }}
            >
              {`${CONFIG.ENV.toLocaleUpperCase()} ${CONFIG.Version}`}{' '}
            </Typography>
          )}
          {CONFIG.ENV.toLocaleLowerCase() === 'live' && (
            <Typography sx={{ color: '#897A69', fontSize: '10px' }}> {CONFIG.Version} </Typography>
          )}
        </Link>

        <NavSectionMini data={navConfig} />
      </Stack>
    </Box>
  );
}
