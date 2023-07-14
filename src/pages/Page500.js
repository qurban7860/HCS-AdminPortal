import { m } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Button, Typography , Grid } from '@mui/material';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { SeverErrorIllustration } from '../assets/illustrations';
import { CONFIG } from '../config-global';

// ----------------------------------------------------------------------

export default function Page500() {
  return (
    <>
      {/* <Helmet>
        <title> 500 Internal Server Error | {CONFIG.APP_TITLE} </title>
      </Helmet> */}

      <MotionContainer >
        <Grid sx={{display:'flex', flexDirection:'column', justifyContent:'center',alignItems:'center',mt:5}}>

        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>
            500 Internal Server Error
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            There was an error, please try again later.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <SeverErrorIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button onClick={()=> window.open('/','_self')} size="large" variant="contained">
          Go to Home
        </Button>
        </Grid>
      </MotionContainer>
    </>
  );
}
