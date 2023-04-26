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
import theme from '../../theme';

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
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: -3,
          }}
          alignItems="center"
          container
          spacing={2}
        >
          <Grid item xs={6}>
            <Typography
              sx={{
                backgroundColor: CONFIG.Background_Color,
                borderRadius: '2px',
                textAlign: 'center',
                fontWeight: 'bold',
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
            <Logo
              sx={{
                width: { lg: '280px', md: '260px', sm: '255px', xs: '250px' },
                pointerEvents: 'none',
              }}
            />
          </Grid>
        </Grid>
        <Stack sx={{ width: '100%' }}> {children} </Stack>
      </StyledContent>
    </StyledRoot>
  );
}
