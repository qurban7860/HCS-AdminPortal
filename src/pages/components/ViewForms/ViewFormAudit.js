import PropTypes from 'prop-types';
import { memo } from 'react';
import { Typography, Grid } from '@mui/material';
import { fDateTime } from '../../../utils/formatTime';

ViewFormAudit.propTypes = {
  defaultValues: PropTypes.object,
};
function ViewFormAudit({ defaultValues }) {
  const { createdByFullName, createdAt, createdIP, updatedByFullName, updatedAt, updatedIP } =
    defaultValues;

  return (
    <Grid container item md={12} sx={{ overflowWrap: 'break-word', display: 'flex', mt:1, px:0.5  }}>
      <Grid item xs={12} sm={6}>
        <Typography paragraph variant="body2" sx={{color: 'text.disabled' }}>
          created by: {createdByFullName ? `${createdByFullName} / ` : ''}{' '}
          {fDateTime(createdAt) ? `${fDateTime(createdAt)} / ` : ''}
          {createdIP ? `${createdIP} ` : ''}
        </Typography>
      </Grid>

      {/* {createdDate !== updatedDate && ( */}
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" sx={{color: 'text.disabled' }}>
            updated by: {updatedByFullName ? `${updatedByFullName} / ` : ''}
            {fDateTime(updatedAt) ? `${fDateTime(updatedAt)} / ` : ''}
            {updatedIP ? `${updatedIP}` : ''}
          </Typography>
        </Grid>
      {/* )} */}
    </Grid>
  );
}
export default memo(ViewFormAudit)