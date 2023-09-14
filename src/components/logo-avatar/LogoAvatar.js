import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
// import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, src="/logo/HowickIcon.svg", ...other }, ref) => {
  // const theme = useTheme();

  // const PRIMARY_LIGHT = theme.palette.primary.light;

  // const PRIMARY_MAIN = theme.palette.primary.main;

  // const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  const logo = (
    <Box
      component="img"
      src={src}
      sx={{ width: 150, height: 150, cursor: 'pointer', bgcolor: "white", zIndex: 40, ...sx }}
    />
  );
  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} to="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});
Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
  src: PropTypes.string,
};

export default Logo;
