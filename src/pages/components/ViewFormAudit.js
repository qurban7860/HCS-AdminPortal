import PropTypes from 'prop-types';
import { Typography, Grid} from '@mui/material';
import { fDateTime , fDate } from '../../utils/formatTime';

ViewFormAudit.propTypes = {
    defaultValues: PropTypes.object,
  };
export default function ViewFormAudit({defaultValues}) {
const {createdByFullName,createdAt,createdIP,updatedByFullName,updatedAt,updatedIP} = defaultValues;
  const created =[createdByFullName,createdAt,createdIP]
  const updated =[updatedByFullName,updatedAt,updatedIP]
console.log("defaultValues",defaultValues)
console.log("created",created)
console.log("updated",updated)

    return (
      <>
        <Grid md={12}  sx={{  overflowWrap: "break-word",display:'flex'}}>
            <Grid item xs={12} sm={6} >
                <Typography paragraph variant="body2" sx={{ px:2, color: 'text.disabled' }}>
                  created by: {created.join(', ')}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={6} >
                <Typography variant="body2" sx={{px:2,  color: 'text.disabled' }}>
                  updated by: {updated.join(', ')}
                </Typography>
            </Grid>
        </Grid>
      </>
    )
}