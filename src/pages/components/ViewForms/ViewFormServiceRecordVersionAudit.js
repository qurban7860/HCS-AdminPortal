import PropTypes from 'prop-types';
import { memo } from 'react';
import { Typography, Grid } from '@mui/material';
import { fDateTime } from '../../../utils/formatTime';

ViewFormServiceRecordVersionAudit.propTypes = {
  value: PropTypes.object,
};
function ViewFormServiceRecordVersionAudit({ value }) {

  return (
  <Grid sx={{ display: {md:'flex', sm:'block'}, justifyContent: 'space-between' }}>
    {value?.checkItemValue && <>
      <Typography variant="body2" sx={{color: 'text.disabled',mr:'auto'}} >{`Version: ${value?.serviceRecord?.versionNo|| 1}`}</Typography>
      <Typography variant="body2" sx={{color: 'text.disabled',ml:'auto'}}>
        Last Modified: {fDateTime(value?.createdAt)}{` by `}{`${value?.valueCreatedBy?.name || ''}`}
      </Typography>
    </>}
  </Grid>
  );
}
export default memo(ViewFormServiceRecordVersionAudit)