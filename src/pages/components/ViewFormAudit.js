import PropTypes from 'prop-types';
import { Typography, Grid} from '@mui/material';
import { fDateTime , fDate } from '../../utils/formatTime';

ViewFormAudit.propTypes = {
    defaultValues: PropTypes.object,
  };
export default function ViewFormAudit({defaultValues}) {
    return (
      <>
        <Grid container spacing={0} sx={{  mb:-3,  pt:4, overflowWrap: "break-word",}}>
            <Grid item xs={12} sm={6} >
                <Typography paragraph variant="body2" sx={{ color: 'text.disabled' }}>
                  created by: {defaultValues.createdByFname} {defaultValues.createdByLname}, {fDate(defaultValues.createdAt)}, {defaultValues.createdIP}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} >
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                  updated by: {defaultValues.updatedByFname} {defaultValues.updatedByLname}, {fDate(defaultValues.updatedAt)}, {defaultValues.updatedIP}
                </Typography>
            </Grid>
        </Grid>
      </>
    )
}