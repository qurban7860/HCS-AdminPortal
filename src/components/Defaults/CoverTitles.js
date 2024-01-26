import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

function CoverTitles({title }) {
 
  return (
        <Typography variant='h2'
          sx={{ px: 3, color: 'common.white', mt: { xs: 2, sm:4, lg:6 },
            fontSize: {xs:30, sm:30, md:42, lg:52, xl:52},
            display: { xs: 'flex', md: 'block' },
          }}
        >
          {title && title?.length>23?`${title.substring(0,23)}...`:title}
        </Typography>
      );
}

CoverTitles.propTypes = {
  title: PropTypes.node,
};

export default CoverTitles;
