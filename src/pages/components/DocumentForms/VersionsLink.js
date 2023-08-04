import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Link } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from '../../../components/iconify';

export default function VersionsLink({ onClick, content }) {
  const theme = useTheme();
  return (
    <Link title='View all Versions' onClick={onClick} href="#" underline="none"><Iconify icon="carbon:view" sx={{mb:-0.8, ml:1, width:"25px", height:"25px"}}/></Link>
  );
}

VersionsLink.propTypes = {
  onClick: PropTypes.func,
  content: PropTypes.string,
};

VersionsLink.defaultProps = {
  content: 'View other versions',
};
