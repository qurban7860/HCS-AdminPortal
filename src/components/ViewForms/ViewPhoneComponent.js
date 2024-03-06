import PropTypes from 'prop-types';
import * as React from 'react';
import Chip from '@mui/material/Chip';
import { Typography, Grid } from '@mui/material';

ViewPhoneComponent.propTypes = {
  heading: PropTypes.string,
  variant: PropTypes.string,
  sm: PropTypes.number,
  value: PropTypes.array,
  typeOfContact: PropTypes.string,
};
function ViewPhoneComponent({ heading, variant, sm, value, typeOfContact }) {
  return (
    <Grid container >
      <Grid item xs={12} sm={12} sx={{ px: 0.5, overflowWrap: 'break-word' }} >
        <Typography variant="overline" sx={{ color: 'text.disabled' }}>{heading || ''}</Typography>
        <Typography
          variant={variant}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
            pb: 2,
          }}
        >
          <div>
            {Array.isArray(value) && value?.map((phoneNumber, index) => (
              <Chip
                key={index}
                sx={{ mr: 1, mb: 1 }}
                label={
                  <>
                    <strong>{phoneNumber.type && phoneNumber.type}</strong> {phoneNumber.countryCode && `+${phoneNumber.countryCode} `} {phoneNumber.contactNumber && phoneNumber.contactNumber} {phoneNumber.extensions && `(${phoneNumber.extensions})`}
                  </>
                }
              />
            ))}
          </div>
        </Typography>
      </Grid>
    </Grid>
  );
}
export default React.memo(ViewPhoneComponent)