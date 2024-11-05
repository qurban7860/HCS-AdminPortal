import PropTypes from 'prop-types';
import { memo } from 'react';
import { Typography, Grid } from '@mui/material';
import { fDateTime } from '../../utils/formatTime';

ViewFormServiceReportVersionAudit.propTypes = {
  value: PropTypes.object,
};
function ViewFormServiceReportVersionAudit({ value }) {

  return (
  <Grid sx={{ display: {md:'flex', sm:'block'}, justifyContent: 'space-between' }}>
    {value?.checkItemValue && <>
      <Typography variant="body2" sx={{color: 'text.disabled',mr:'auto'}} >{`Version: ${value?.serviceReport?.versionNo|| ''}`}</Typography>
      <Typography variant="body2" sx={{color: 'text.disabled',ml:'auto'}}>
        Last Modified: {fDateTime(value?.createdAt)}{` by `}{`${value?.createdBy?.name || ''}`}
      </Typography>
    </>}
  </Grid>
  );
}
export default memo(ViewFormServiceReportVersionAudit)