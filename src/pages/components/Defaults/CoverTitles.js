import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

function CoverTitles({ name, nameTitle, serialNo, photoURL, isMobile, children, machineChildren }) {
  return (
    <>
      {serialNo ? (
        <Typography
          variant={isMobile && photoURL ? 'h3' : 'h2'}
          sx={{
            px: 3,
            color: 'common.white',
            mt: { xs: nameTitle.length > 15 ? 5 : 8, md: 6 },
            mb: 0,
            display: { xs: 'flex', md: 'block' },
          }}
        >
          {machineChildren}
        </Typography>
      ) : (
        <Typography
          variant={photoURL ? 'h3' : 'h2'}
          sx={{
            px: 3,
            color: 'common.white',
            mt: { xs: 7, md: 6 },
            display: { xs: 'flex', md: 'block' },
          }}
        >
          {children}
        </Typography>
      )}
    </>
  );
}

CoverTitles.propTypes = {
  name: PropTypes.string,
  nameTitle: PropTypes.string,
  serialNo: PropTypes.string,
  photoURL: PropTypes.string,
  isMobile: PropTypes.bool,
  children: PropTypes.node,
  machineChildren: PropTypes.node,
};

export default CoverTitles;
