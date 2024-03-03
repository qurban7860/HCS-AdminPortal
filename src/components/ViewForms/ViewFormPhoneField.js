import PropTypes from 'prop-types';
import React from 'react';

// ... rest of your code

// import { memo } from 'react';
import { Typography, Grid } from '@mui/material';

ViewFormPhoneField.propTypes = {
  heading: PropTypes.string,
  variant: PropTypes.string,
  sm: PropTypes.number,
  value: PropTypes.array,
  typeOfContact: PropTypes.string,
};
function ViewFormPhoneField({ heading, variant, sm, value, typeOfContact }) {


  return (
    <Grid container >
    <Grid item xs={12} sm={12} sx={{ px: 0.5,  overflowWrap: 'break-word' }} >
      <Typography variant="overline" sx={{ color: 'text.disabled' }}>{ heading || ''}</Typography>
      <Typography
  variant={variant}
  sx={{
    display: 'flex',
    flexDirection: 'column', // Display items in a column
    whiteSpace: 'pre-line',
    wordBreak: 'break-word',
    pb: 2,
  }}
>
  {value?.map((num, index) => (
    num?.contactNumber && (
      <React.Fragment key={index}>
        
          {`${[1, 2, 4, 5, 7, 8, 10, 11, 13, 14].includes(index) ? ', ' : ''} ${num?.type} +${num?.countryCode || ''} ${num?.contactNumber || ''} ${
            num?.extensions ? ` - (${num?.extensions})` : ''
          }`}
        
        {(index + 1) % 3 === 0 && <br />} {/* Line break after every three numbers */}
      </React.Fragment>
    )
  ))}
</Typography>


        
      </Grid> 
      </Grid>
  );
}
export default React.memo(ViewFormPhoneField)