// @mui
import { Button, Typography, Grid } from '@mui/material';
// components
import { MotionContainer } from '../components/animate';
import Logo from '../components/logo';

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <MotionContainer>
      <Grid sx={{ width: '900px', margin: 'auto', textAlign: 'center', pt: 10 }}>
        <Typography variant="p" sx={{ color: 'text.secondary' }} paragraph>
          Ooppps... page not found{' '}
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
          Sorry, we couldn&apos;t find the page you&apos;re looking for. Perhaps you&apos;ve
          mistyped the URL? Be sure to check your spelling
        </Typography>
        <Button onClick={() => window.open('/', '_self')} size="large" variant="contained">
          Go Back
        </Button>
      </Grid>
    </MotionContainer>
  );
}
