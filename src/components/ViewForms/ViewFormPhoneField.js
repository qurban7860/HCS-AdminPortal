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


  return (
    <Grid container >
    {value?.length > 0 ? value?.map( (num) =>(
    <Grid item xs={12} sm={sm} sx={{ px: 0.5, py: 1, overflowWrap: 'break-word' }} >
      <Typography variant="overline" sx={{ color: 'text.disabled' }}>{ num?.type || heading || ''}</Typography>
        <Typography variant={variant}
          style={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
          }} >
          {num?.number && `+${num?.countryCode || '' } ${ num?.number || '' } ` }{num?.extensions && ` (ext: ${num?.extensions} )` }
        </Typography>
    </Grid>
      )) : ( 
    <Grid item xs={12} sm={sm} sx={{ px: 0.5, py: 1, overflowWrap: 'break-word' }} >
      <Typography variant="overline" sx={{ color: 'text.disabled' }}>{ heading || 'Phone'}</Typography>
        <Typography variant={variant}
          style={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
          }}>{' '}</Typography>
    </Grid>
      ) }
      </Grid>
  );
}
export default memo(ViewFormPhoneField)