import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import useLimitString from '../../hooks/useLimitString';


export default function BreadcrumbsLink({ name, to }) {
  return (
    <Link
      underline="none"
      color="inherit"
      component={RouterLink}
      to={to}
      sx={{ fontSize: '12px', color: 'text.disabled' }}
    >
      { useLimitString( name, 25 ) }
    </Link>
  );
}

BreadcrumbsLink.propTypes = {
  name: PropTypes.node,
  to: PropTypes.any,
};
