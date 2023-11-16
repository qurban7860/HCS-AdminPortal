import PropTypes from 'prop-types';
import { memo } from 'react';
import { Typography, Grid } from '@mui/material';
import { fDateTime } from '../../../utils/formatTime';

ViewFormAprovedSubmit.propTypes = {
  submittedInfo: PropTypes.object,
  approvedInfo: PropTypes.object,
};
function ViewFormAprovedSubmit({ submittedInfo, approvedInfo }) {
  const { submittedBy, submittedDate,  } = submittedInfo;
  const { verifiedBy, verifiedDate } = approvedInfo;

  return (
    <Grid container item md={12} sx={{ overflowWrap: 'break-word', display: 'flex', mt:1  }}>
      <Grid item xs={12} sm={6}>
        <Typography paragraph variant="body2" sx={{ px: 2, color: 'text.disabled' }}>
          submitted by: {submittedBy?.name ? `${submittedBy?.name} / ` : ''}{' '}
          {fDateTime(submittedDate) ? `${fDateTime(submittedDate)}` : ''}
        </Typography>
      </Grid>

      {/* {createdDate !== updatedDate && ( */}
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" sx={{ px: 2, color: 'text.disabled' }}>
            approved by: {verifiedBy?.name ? `${verifiedBy?.name} / ` : ''}
            {fDateTime(verifiedDate) ? `${fDateTime(verifiedDate)}` : ''}
          </Typography>
        </Grid>
      {/* )} */}
    </Grid>
  );
}
export default memo(ViewFormAprovedSubmit)