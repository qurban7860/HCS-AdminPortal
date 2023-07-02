import PropTypes from 'prop-types';
import {  Typography,} from '@mui/material';

FormHeading.propTypes = {
  heading: PropTypes.string,
  };
export default function FormHeading({heading}) {
    return (
  
        <Typography variant="h4" sx={{ color: 'text.secondary' }}>
                    {heading}
        </Typography>
  
    )
}