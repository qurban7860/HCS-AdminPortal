import PropTypes from 'prop-types';
import { Typography, Grid } from '@mui/material';
import { fDateTime, fDate } from '../../../utils/formatTime';

ViewFormAudit.propTypes = {
  defaultValues: PropTypes.object,
};
export default function ViewFormAudit({ defaultValues }) {
  const { createdByFullName, createdAt, createdIP, updatedByFullName, updatedAt, updatedIP } =
    defaultValues;

  const created = [createdByFullName, createdAt, createdIP];
  const updated = [updatedByFullName, updatedAt, updatedIP];

  // const createdDate = fDateTime(createdAt);
  // const updatedDate = fDateTime(updatedAt);

  return (
    <Grid container item md={12} sx={{ overflowWrap: 'break-word', display: 'flex', mt:1  }}>
      <Grid item xs={12} sm={6}>
        <Typography paragraph variant="body2" sx={{ px: 2, color: 'text.disabled' }}>
          created by: {createdByFullName ? `${createdByFullName} / ` : ''}{' '}
          {fDateTime(createdAt) ? `${fDateTime(createdAt)} / ` : ''}
          {createdIP ? `${createdIP} ` : ''}
        </Typography>
      </Grid>

      {/* {createdDate !== updatedDate && ( */}
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" sx={{ px: 2, color: 'text.disabled' }}>
            updated by: {updatedByFullName ? `${updatedByFullName} / ` : ''}
            {fDateTime(updatedAt) ? `${fDateTime(updatedAt)} / ` : ''}
            {updatedIP ? `${updatedIP}` : ''}
          </Typography>
        </Grid>
      {/* )} */}
    </Grid>
  );
}
