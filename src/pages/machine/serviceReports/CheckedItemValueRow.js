import { memo } from 'react'
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import StatusAndComment from './StatusAndComment';

const CheckedItemValueRow = ({value, index, machineId, primaryServiceReportId }) => (
    <Grid sx={{ border: '1px solid #e1e1e1', borderRadius: '7px', mt:1, p:1, backgroundColor: '#f3f4f594'}}>
    <Typography variant="h5" sx={{ display: 'flex' }}>
      <b>{index + 1}- </b>
      {value?.ListTitle || ''} (Items: <b>{value?.checkItems?.length || 0}</b>)
    </Typography>
      <Grid>
          {value?.checkItems?.map((childRow, childIndex) => (
            <StatusAndComment
              isBorder
              machineId={machineId}
              primaryServiceReportId={primaryServiceReportId}
              index={index}
              childIndex={childIndex}
              key={childRow._id}
              childRow={childRow}
            />
          ))}
      </Grid>   
    </Grid>
  );

CheckedItemValueRow.propTypes = {
    index: PropTypes.number,
    value: PropTypes.object,
    machineId: PropTypes.string,
    primaryServiceReportId: PropTypes.string,
  };

export default memo(CheckedItemValueRow)