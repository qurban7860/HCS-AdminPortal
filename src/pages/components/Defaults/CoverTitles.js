import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

function CoverTitles({ name, nameTitle, serialNo, isMobile, children, machineChildren }) {
  return (
    <>
      {serialNo ? (
        <Typography
          variant={isMobile ? 'h3' : 'h2'}
          sx={{
            px: 3,
            color: 'common.white',
            mt: { xs: nameTitle.length > 15 ? 5 : 8, md: 6, sm:6 },
            mb: 0,
            display: { xs: 'flex', md: 'block' },
          }}
        >
          {machineChildren.length>20?`${machineChildren.substring(0,20)}...`:machineChildren}
        </Typography>
      ) : (
        <Typography
          variant={isMobile ? 'h3' : 'h2'}
          sx={{
            px: 3,
            color: 'common.white',
            mt: { xs: 7, md: 6 },
            display: { xs: 'flex', md: 'block' },
          }}
        >
          {children.length>20?`${children.substring(0,20)}...`:children}
        </Typography>
      )}
    </>
  );
}

CoverTitles.propTypes = {
  name: PropTypes.string,
  nameTitle: PropTypes.string,
  serialNo: PropTypes.string,
  isMobile: PropTypes.bool,
  children: PropTypes.node,
  machineChildren: PropTypes.node,
};

export default CoverTitles;
