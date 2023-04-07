import PropTypes from 'prop-types';
import { Typography, Grid} from '@mui/material';

ViewFormSubtitle.propTypes = {
    heading: PropTypes.string,
    sm: PropTypes.number,
  };
export default function ViewFormSubtitle({heading,sm}) {
    return (
      <>
        <Grid item xs={12} sm={sm} sx={{ pt:2, overflowWrap: "break-word", }}>
                <Typography variant="subtitle2" sx={{ color: '#131414' }}>{heading}</Typography>
        </Grid>
      </>
    )
}