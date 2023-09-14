import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumbs } from '@mui/material';

BreadcrumbsProvider.propTypes = {
  children: PropTypes.node,
};

export default function BreadcrumbsProvider({ children }) {
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator="›"
      sx={{ fontSize: '12px', color: 'text.disabled' }}
    >
      {children}
    </Breadcrumbs>
  );
}
