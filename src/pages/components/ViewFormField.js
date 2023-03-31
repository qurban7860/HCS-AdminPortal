import PropTypes from 'prop-types';
import { Typography, Grid} from '@mui/material';

ViewFormField.propTypes = {
    heading: PropTypes.string,
    param: PropTypes.string,
    secondParam: PropTypes.string,
    sm: PropTypes.number,
  };

export default function ViewFormField({heading,param,secondParam,sm}) {
    return (
      <>
        <Grid item xs={12} sm={sm} sx={{ pt:2 }}>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                    {heading}
                </Typography>
                <Typography variant="body2">{param} {secondParam}</Typography>
            </Grid>
      </>
    )
}