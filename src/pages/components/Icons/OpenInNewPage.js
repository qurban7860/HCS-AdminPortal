import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@mui/material';
import Iconify from '../../../components/iconify';

export default function OpenInNewPage({ onClick }) {
  return (
    <Link
        onClick={onClick}
        color="inherit"
        target="_blank"
        rel="noopener"
        sx={{ cursor: 'pointer',mx: 0.5, }}
    >
      <Iconify
        icon="fluent:open-12-regular"
        color="blue"
        width="1.5em"
        sx={{
          mb: -0.5,
        }}
      />
    </Link>
  );
}

OpenInNewPage.propTypes = {
  onClick: PropTypes.func,
};
