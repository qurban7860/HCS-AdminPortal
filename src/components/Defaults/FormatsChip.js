import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Chip } from '@mui/material';
import { allowedExtensions, imagesExtensions } from '../../constants/document-constants';

FormatsChip.propTypes = {
  imagesOnly: PropTypes.bool
};


export default function FormatsChip({imagesOnly}) {
  return (
    <>
      {imagesOnly?(
        imagesExtensions.map((ext, index) => (
          <Grid display="inline-flex" p={0.1}>
            <Chip
              key={index}
              label={ext}
              size="small"
              sx={{color: 'primary.main', cursor:'default'}}
            />
          </Grid>
        ))
      ):(
        allowedExtensions.map((ext, index) => (
          <Grid display="inline-flex" p={0.1}>
            <Chip
              key={index}
              label={ext}
              size="small"
              sx={{color: 'primary.main', cursor:'default'}}
            />
          </Grid>
        ))
      ) }
    </>
  );
}
