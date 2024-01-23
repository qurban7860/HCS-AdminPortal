import PropTypes from 'prop-types';
import { memo } from 'react';
import { Typography, Grid } from '@mui/material';
import { fDateTime } from '../../utils/formatTime';

ViewFormAuditBlock.propTypes = {
  defaultValues: PropTypes.object,
};
function ViewFormAuditBlock({ defaultValues }) {
  const { createdByFullName, createdBy, updatedBy, createdAt, createdIP, updatedByFullName, updatedAt, updatedIP } =
    defaultValues;

  return (
    <Grid container item  sx={{ overflowWrap: 'break-word', display: 'block', mt:1, px:0.5  }}>
      <Grid item sm={12} >
        <Typography paragraph variant="body2" sx={{color: 'text.disabled' }}>
          created by: { `${createdByFullName || createdBy?.name || ''} / ` }{' '}
          {fDateTime(createdAt) ? `${fDateTime(createdAt)} / ` : ''}
          { `${createdIP || ''} `}
        </Typography>
      </Grid>

      {/* {createdDate !== updatedDate && ( */}
        <Grid item sm={12} >
          <Typography variant="body2" sx={{color: 'text.disabled' }}>
            updated by: { `${updatedByFullName || updatedBy?.name || '' } / ` }
            {fDateTime(updatedAt) ? `${fDateTime(updatedAt)} / ` : ''}
            {`${updatedIP || ''}` }
          </Typography>
        </Grid>
      {/* )} */}
    </Grid>
  );
}
export default memo(ViewFormAuditBlock)