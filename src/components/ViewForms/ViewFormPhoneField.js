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
    <Grid item xs={12} sm={12} sx={{ px: 0.5,  overflowWrap: 'break-word' }} >
      <Typography variant="overline" sx={{ color: 'text.disabled' }}>{ heading || ''}</Typography>
        <Typography variant={variant}
          sx={{
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
            pb: 2,
          }} >
    {value?.map( (num , index ) =>
          num?.number && `${index !== 0 ? ', ': ''} (${num?.type }) +${num?.countryCode || '' } ${ num?.number || '' } - ext: ${num?.extensions} ` 
          ) }
        </Typography>
    </Grid> 
      </Grid>
  );
}
export default memo(ViewFormPhoneField)