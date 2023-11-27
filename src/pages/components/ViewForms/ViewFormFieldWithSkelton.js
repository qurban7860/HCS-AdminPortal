import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid } from '@mui/material';
import SkeletonViewFormField from '../../../components/skeleton/SkeletonViewFormField';

function ViewFormFieldWithSkelton({
  heading,
  param,
  sm,
  variant,
  isLoading,
  handleOnClick,
}) {
  
  
  return (
    <Grid item xs={12} sm={sm} sx={{ px: 2, py: 1, overflowWrap: 'break-word' }}>
      <Typography variant="overline" sx={{ color: 'text.disabled' }}>{heading}</Typography>
      {isLoading ? (
          <SkeletonViewFormField variant={variant} />
      ) : (
          <Typography variant={variant} sx={{minHeight:27}}>{param}</Typography>
      )}
    </Grid>
  );
}
export default memo(ViewFormFieldWithSkelton) 
ViewFormFieldWithSkelton.propTypes = {
  heading: PropTypes.string,
  param: PropTypes.string,
  sm: PropTypes.number,
  isLoading: PropTypes.bool,
  handleOnClick: PropTypes.func,
  variant: PropTypes.string
};
