import PropTypes from 'prop-types';
import * as React from 'react';
import Chip from '@mui/material/Chip';
import { Typography, Grid } from '@mui/material';
import SkeletonViewFormField from '../skeleton/SkeletonViewFormField';

ViewPhoneComponent.propTypes = {
  heading: PropTypes.string,
  variant: PropTypes.string,
  sm: PropTypes.number,
  value: PropTypes.any,
  isLoading:PropTypes.bool
};
function ViewPhoneComponent({ heading, variant, sm, value, isLoading }) {
  return (
    <Grid container >
      <Grid item xs={12} sm={12} sx={{ px: 0.5, overflowWrap: 'break-word' }} >
        <Typography variant="overline" sx={{ color: 'text.disabled', pb:1 }}>{heading || ''}</Typography>
        {isLoading ? (
          <SkeletonViewFormField />
          ) : (
              <Grid>
                {Array.isArray(value) && value?.map((phoneNumber, index) => (
                  <Chip
                    key={index}
                    sx={{ m: 0.2 }}
                    label={
                      <>
                        <strong>{phoneNumber.type && phoneNumber.type}</strong> {phoneNumber.countryCode && `+${phoneNumber.countryCode} `} {phoneNumber.contactNumber && phoneNumber.contactNumber} {phoneNumber.extensions && `(${phoneNumber.extensions})`}
                      </>
                    }
                  />
                ))}
              </Grid>
          )
        }
      </Grid>
    </Grid>
  );
}
export default React.memo(ViewPhoneComponent)