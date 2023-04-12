import PropTypes from 'prop-types';
import { Typography, Grid} from '@mui/material';

ViewFormField.propTypes = {
    heading: PropTypes.string,
    param: PropTypes.string,
    stasticsParam: PropTypes.string,
    secondStasticsParam: PropTypes.string,
    sm: PropTypes.number,
  };
export default function ViewFormField({heading,param,stasticsParam,secondStasticsParam,sm}) {
    return (
      <>
        <Grid item xs={12} sm={sm} sx={{ px:2,py:1, overflowWrap: "break-word", }}>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                    {heading}
                </Typography>
                <Typography variant="body2">{stasticsParam} {secondStasticsParam}</Typography>
            </Grid>
      </>
    )
}