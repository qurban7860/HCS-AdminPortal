import { memo } from 'react'
import PropTypes from 'prop-types';
import { Grid, TableContainer, Table, TableBody, Typography } from '@mui/material';
import StatusAndComment from './StatusAndComment';

const CheckedItemValueRow = ({value, index, machineId, serviceId }) => (
    <Grid sx={{ border: '1px solid #e1e1e1', borderRadius: '7px', mt:1, p:1, backgroundColor: '#f3f4f594'}}>
      <Typography variant='h5' sx={{ display: 'flex'}}>
          <b>{`${index+1}- `}</b>{typeof value?.ListTitle === 'string' && value?.ListTitle || ''} {' ( Items: '}<b>{`${value?.checkItems?.length || 0}`}</b>{' ) '} 
      </Typography>
      <Grid  >
      <TableContainer >
        <Table size="small" aria-label="simple table" >
          <TableBody  >
          {value?.checkItems?.map((childRow, childIndex) => (
            <StatusAndComment
              machineId={machineId}
              serviceId={serviceId}
              index={index}
              childIndex={childIndex}
              key={childRow._id}
              childRow={childRow}
            />
          ))}
          </TableBody>
        </Table>
        </TableContainer>
      </Grid>   
    </Grid>
  );

CheckedItemValueRow.propTypes = {
    index: PropTypes.number,
    value: PropTypes.object,
    machineId: PropTypes.string,
    serviceId: PropTypes.string,
  };

export default memo(CheckedItemValueRow)