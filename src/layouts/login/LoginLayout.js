import PropTypes from 'prop-types';
// @mui
import { Typography, Stack , Grid} from '@mui/material';
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
    <StyledRoot >
      <StyledContent >
      <Grid sx={{display: 'flex',justifyContent: 'center', alignItem:'baseline',mb:-3}}>
        <Logo
          sx={{ width:{ lg:'280px',md:'260px', sm:'225px',xs: '205px'} }}
        />
      </Grid>
        <Stack sx={{ width: '100%' }}> {children} </Stack>
      </StyledContent>
    </StyledRoot>
  );
}
