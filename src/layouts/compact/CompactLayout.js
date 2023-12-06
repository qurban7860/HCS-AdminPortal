import { Outlet } from 'react-router-dom';
// @mui
import { Stack, Container } from '@mui/material';

// ----------------------------------------------------------------------

export default function CompactLayout() {
  
  return (
    <Container component="main">
      <Stack
        sx={{
          py: 12,
          m: 'auto',
          maxWidth: 400,
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
