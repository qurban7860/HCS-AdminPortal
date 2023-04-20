import PropTypes from 'prop-types';
// @mui
import { Badge, Box, Typography, Stack , Grid} from '@mui/material';
// components
import Logo from '../../components/logo';
import Image from '../../components/image';
//
import { CONFIG } from '../../config-global';
//
import { StyledRoot, StyledSectionBg, StyledSection, StyledContent } from './styles';

// ----------------------------------------------------------------------

LoginLayout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  illustration: PropTypes.string,
};

export default function LoginLayout({ children, illustration, title }) {
  return (
    <StyledRoot>
      <StyledContent>
        <Grid
          sx={{ display: 'flex', justifyContent: 'center', mb: -3 }}
          alignItems="center"
          container
          spacing={2}
        >
          <Grid item>
            <Typography
              variant="h5"
              className="z-0"
              sx={{
                // backgroundColor: '#FFA200',
                border: '1px solid #FFA200',
                borderRadius: '3px',
                p: 1,
                py: 0.1,
              }}
            >
              {CONFIG.ENV}
              {'  '}
              {CONFIG.Version}
            </Typography>
          </Grid>
          <Grid item>
            <Logo sx={{ width: { lg: '280px', md: '260px', sm: '225px', xs: '205px', pointerEvents: 'none' }}} />
          </Grid>
        </Grid>
        <Stack sx={{ width: '100%' }}> {children} </Stack>
      </StyledContent>
    </StyledRoot>
  );
}
