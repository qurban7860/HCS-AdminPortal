// @mui
import { Button, Typography, Grid } from '@mui/material';
// components
import { MotionContainer } from '../components/animate';
import Logo from '../components/logo';

// ----------------------------------------------------------------------

export default function Page403() {
  return (
    <MotionContainer>
      <Grid sx={{ width: '900px', margin: 'auto', textAlign: 'center', pt: 10 }}>
        <Typography variant="p" sx={{ color: 'text.secondary' }} paragraph>
          You&apos;re not authorized to access this page{' '}
        </Typography>
        <Logo
          sx={{
            width: '60%',
            margin: 'auto',
            filter: 'grayscale(100%) opacity(30%)',
            pointerEvents: 'none',
            pt: 30,
            pb: 20,
          }}
        />
        <Typography
          variant="p"
          sx={{ color: '#c9c9c9', fontSize: 16, p: 19, pt: 0, pb: 2 }}
          paragraph
        >
          This server is aware of the request, but denies access due to insufficient permissions.
          This indicates that you don&apos;t possess the required authorization to view the
          requested page or resource. Contact the system Administrator
        </Typography>
        <Button onClick={() => window.open('/', '_self')} size="large" variant="contained">
          Go Back
        </Button>
      </Grid>
    </MotionContainer>
  );
}
