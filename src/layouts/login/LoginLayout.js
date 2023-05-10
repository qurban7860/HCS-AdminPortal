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
          spacing={2}
          container
        >
          <Grid item>
            <Logo
              sx={{
                width: '100%',
                p: 1,
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
