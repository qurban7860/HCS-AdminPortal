import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { useScreenSize } from '../../../hooks/useResponsive';

function CoverTitles({ name, nameTitle, serialNo, isMobile, children, machineChildren }) {
  const smScreen = useScreenSize('sm');
  const mdScreen = useScreenSize('md');
  const lgScreen = useScreenSize('lg');
  const xlScreen = useScreenSize('xl');
  
  let variant = 'h2';
  
  if(smScreen) variant="h4";
  if(mdScreen) variant="h3";
  if(lgScreen) variant="h2";
  if(xlScreen) variant="h2";
  
  return (
    <>
      {serialNo ? (
        <Typography
          variant={variant}
          sx={{
            px: 3,
            color: 'common.white',
            mt: { xs: nameTitle.length > 15 ? 5 : 8, md: 6, sm:6 },
            mb: 0,
            display: { xs: 'flex', md: 'block' },
          }}
        >
          {machineChildren &&  machineChildren?.length>26?`${machineChildren.substring(0,26)}...`:machineChildren}
        </Typography>
      ) : (
        <Typography
          variant={variant}
          sx={{
            px: 3,
            color: 'common.white',
            mt: { xs: 7, md: 6 },
            display: { xs: 'flex', md: 'block' },
          }}
        >
          
          {children && children?.length>26?`${children.substring(0,26)}...`:children}
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
