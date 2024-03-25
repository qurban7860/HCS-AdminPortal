// @mui
import { Button, Typography, Grid } from '@mui/material';
import { useMemo } from 'react';
// components
import { MotionContainer } from '../components/animate';
import Logo from '../components/logo';


// ----------------------------------------------------------------------

export default function MachineNotFoundPage() {
  const configurations = JSON.parse(localStorage.getItem('configurations'));
  const content = configurations?.find((config) => (config.type === 'ERROR-PAGES' && config.name === 'machineNotFound'));

  const defaultValues = useMemo(
    () => ({
      title: content?.value || "Ooppps... Machine not found!",
      message: content?.notes || "Sorry, we couldn't find the Machine you're looking for. Perhaps you've mistyped the Serial Number? Be sure to check your spelling!",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );


  return (
    <MotionContainer>
      <Grid sx={{ width: '900px', margin: 'auto', textAlign: 'center', pt: 10 }}>
        <Typography variant="p" sx={{ color: 'text.secondary' }} paragraph>{defaultValues.title}</Typography>
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
        <Typography variant="p" sx={{ color: '#c9c9c9', fontSize: 16, p: 19, pt: 0, pb: 2 }} paragraph>
          {defaultValues.message}
        </Typography>
        <Button onClick={() => window.open('/', '_self')} size="large" variant="contained">Go Back</Button>
      </Grid>
    </MotionContainer>
  );
}
