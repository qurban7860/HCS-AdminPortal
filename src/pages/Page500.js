// @mui
import { Button, Typography, Grid } from '@mui/material';
// components
import { MotionContainer } from '../components/animate';
import Logo from '../components/logo';

// ----------------------------------------------------------------------

export default function Page500() {
  return (
    <MotionContainer>
      <Grid sx={{ width: '900px', margin: 'auto', textAlign: 'center', pt: 10 }}>
        <Typography variant="p" sx={{ color: 'text.secondary' }} paragraph>
          Ooppps.. an error has occured
        </Typography>
        <Logo
          sx={{
            width: '60%',
            margin: 'auto',
            filter: 'grayscale(100%) opacity(30%)',
            pointerEvents: 'none',
            pt: 20,
            pb: 20,
          }}
        />
        <Typography
          variant="p"
          sx={{ color: '#c9c9c9', fontSize: 16, p: 19, pt: 0, pb: 2 }}
          paragraph
        >
          We&apos;re committed to delivering a seamless and delightful user experience. We apologies
          for the inconvenience, Thank you for your understanding, and stay tuned for updates.
          We&apos;ll be back before you know it.
        </Typography>
        <Button onClick={() => window.open('/', '_self')} size="large" variant="contained">
          Go Back
        </Button>
      </Grid>
    </MotionContainer>
  );
}
