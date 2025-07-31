import { Outlet } from 'react-router-dom';

import { Container, Stack } from '@mui/system';
// ----------------------------------------------------------------------

export default function SimpleLayout() {

  return (
      <Container component="main">
        <Stack
          sx={{
            py: 1,
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
