import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Button, Typography } from '@mui/material';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { ForbiddenIllustration } from '../assets/illustrations';

ErrorPage.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};

export default function ErrorPage({title, message}) {  
  message = message || "Please contact administrator";
  return (
      <MotionContainer>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" paragraph>{title}</Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>{message}</Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>

        <Button component={RouterLink} to="/" size="large" variant="contained">
          Go to Home
        </Button>
      </MotionContainer>
  );
}
