import PropTypes from 'prop-types';
import { memo } from 'react';
import { Typography, Grid, Chip } from '@mui/material';
import { fDateTime } from '../../utils/formatTime';

ViewFormAprovedSubmit.propTypes = {
  submittedInfo: PropTypes.object,
  approvedInfo: PropTypes.array,
};
function ViewFormAprovedSubmit({ submittedInfo, approvedInfo }) {
  const { submittedBy, submittedDate,  } = submittedInfo;

  return (
    <Grid container item md={12} sx={{ overflowWrap: 'break-word', display: 'flex', mt:1  }}>
      <Grid item xs={12} sm={6}>
        <Typography paragraph variant="body2" sx={{ px: 2, color: 'text.disabled' }}>
          submitted by: {submittedBy?.name ? `${submittedBy?.name} / ` : ''}{' '}
          {fDateTime(submittedDate) ? `${fDateTime(submittedDate)}` : ''}
        </Typography>
      </Grid>

        <Grid item xs={12} sm={12}>
          <Typography variant="body2" sx={{ px: 2, color: 'text.disabled' }}>
            approved by: {approvedInfo?.map((approveBy) => <Chip size='small' label={`${approveBy?.approvedBy?.name || ''} / ${fDateTime(approveBy?.approvedDate)}`} sx={{m:0.3}} /> )}
          </Typography>
        </Grid>
    </Grid>
  );
}
export default memo(ViewFormAprovedSubmit)