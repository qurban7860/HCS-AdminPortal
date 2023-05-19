import PropTypes from 'prop-types';
import { Typography, Grid} from '@mui/material';

CommaJoinField.propTypes = {
    objectParam: PropTypes.object,
    sm: PropTypes.number,
  };
export default function CommaJoinField({  objectParam, sm}) {
    return (
     <Grid item xs={12} sm={sm} > <Typography  >{Object.values(objectParam ?? {}).map(value => typeof value === "string" ? value.trim() : "").filter(value => value !== "").join(", ")} </Typography>
     </Grid>
    )
}