import { Outlet } from 'react-router-dom';

import { Container, Stack } from '@mui/system';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
// config
import { HEADER } from '../../config-global';
// components
import Header from './Header';

// ----------------------------------------------------------------------

export default function SimpleLayout() {
  // const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

  return (
      <Container component="main">
        <Stack
          sx={{
            py: 12,
            padding:0,
            m: 'auto',
            maxWidth: 500,
            minHeight: '100vh',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <Outlet />
        </Stack>
      </Container>
  );
}
