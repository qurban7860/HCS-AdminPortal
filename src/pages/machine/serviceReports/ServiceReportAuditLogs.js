import PropTypes from 'prop-types';
import React from 'react';
import { Typography } from '@mui/material';
import { fDateTime } from '../../../utils/formatTime';

function ServiceReportAuditLogs({ data }) {
  return (
    <>
      {data?.updatedBy && 
        <Typography variant="body2" 
          sx={{ color: 'text.disabled' }}
        >
          <i>
            {/* <b>Last Modified: </b> */}
            {fDateTime(data?.updatedAt)}{` by `}{`${data?.updatedBy?.name || ''}`}
          </i>
        </Typography>
      }
    </>
  );
}

ServiceReportAuditLogs.propTypes = {
  data: PropTypes.shape({
    updatedAt: PropTypes.string,
    updatedBy: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
};

export default ServiceReportAuditLogs;
