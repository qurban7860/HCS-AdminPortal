// @mui
import { Stack, Box , Typography, Grid} from '@mui/material';
// config
import { NAV, CONFIG } from '../../../config-global';
// utils
import { hideScrollbarX } from '../../../utils/cssStyles';
// components
import Logo from '../../../components/logo';
import { NavSectionMini } from '../../../components/nav-section';
//
import navConfig from './config-navigation';
import NavToggleButton from './NavToggleButton';

// ----------------------------------------------------------------------

export default function NavMini() {
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
          pb: 2,
          height: 1,
          position: 'fixed',
          width: NAV.W_DASHBOARD_MINI,
          borderRight: (theme) => `solid 1px ${theme.palette.divider}`,
          ...hideScrollbarX,
        }}
      >
        <Logo src="/logo/HowickIcon.svg" sx={{ mx: 'auto', my: 2, width: '40px', height: '40px' }} />
        <Grid sx={{ margin: '0 auto', mt: -2, mb: 1 }}>
          <Typography  sx={{ margin: '0 auto', mt: 1, mb: 1, color: '#897A69', fontSize:'8px' }}>
            {CONFIG.Version}
          </Typography>
        </Grid>
        <NavSectionMini data={navConfig} />
      </Stack>
    </Box>
  );
}
