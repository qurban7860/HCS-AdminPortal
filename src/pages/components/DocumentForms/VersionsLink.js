import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Link } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';

export default function VersionsLink({ onClick, content }) {
  const theme = useTheme();
  return (
    <Link onClick={onClick} href="#" underline="none">
      <Typography
        variant="overline"
        sx={{ mt: 0.45, ml: 1 }}
        color={alpha(theme.palette.primary.main, 0.4)}
      >
        {content}
      </Typography>
    </Link>
  );
}

VersionsLink.propTypes = {
  onClick: PropTypes.func,
  content: PropTypes.string,
};

VersionsLink.defaultProps = {
  content: 'View other versions',
};
