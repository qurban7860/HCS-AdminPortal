import PropTypes from 'prop-types';
import { memo } from 'react';
import { Typography, Grid } from '@mui/material';

ViewFormPhoneField.propTypes = {
  heading: PropTypes.string,
  variant: PropTypes.string,
  sm: PropTypes.number,
  value: PropTypes.array,
  typeOfContact: PropTypes.string,
};
function ViewFormPhoneField({ heading, variant, sm, value, typeOfContact }) {

  const contactNumber  = Array.isArray(value)  && value.find( n => n?.type?.toLowerCase() === typeOfContact?.toLowerCase()  );

  return (
    <Grid item xs={12} sm={sm} sx={{ px: 0.5, py: 1, overflowWrap: 'break-word' }} >
      <Typography variant="overline" sx={{ color: 'text.disabled' }}>{heading || ''}</Typography>
        <Typography variant={variant}
          style={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
          }}>
          {contactNumber?.number && `+${contactNumber?.countryCode || '' } ${ contactNumber?.number || '' }`}
        </Typography>
    </Grid>
  );
}
export default memo(ViewFormPhoneField)