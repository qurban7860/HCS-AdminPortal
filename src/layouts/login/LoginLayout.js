import PropTypes from 'prop-types';
// @mui
import { Box, Typography, Stack , Grid} from '@mui/material';
// components
import Logo from '../../components/logo';
import Image from '../../components/image';
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
        <Grid sx={{ display: 'flex', justifyContent: 'center', alignItem: 'baseline', mb: -3 }}>
          {/* <Box sx={{ display: 'inline-block', border: '1px solid red'}}>
            <Typography
              variant="h5"
              className="z-0"
              sx={{ display: 'flex', justifyContent: 'center', mb: 'auto' }}
            >
              DEV
            </Typography>
          </Box> */}

          <Logo sx={{ width: { lg: '280px', md: '260px', sm: '225px', xs: '205px' } }} />
        </Grid>
        <Stack sx={{ width: '100%' }}> {children} </Stack>
      </StyledContent>
    </StyledRoot>
  );
}
