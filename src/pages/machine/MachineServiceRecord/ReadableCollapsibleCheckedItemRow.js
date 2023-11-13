import { useState, memo } from 'react'
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { Box, Grid, Table, TableBody, TableCell, TableRow,  IconButton, Collapse, Typography, Checkbox, Chip } from '@mui/material';
import Iconify from '../../../components/iconify';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons'
import StatusAndComment from './StatusAndComment';

const CollapsibleCheckedItemRow = ({value, index }) => {
  const [open, setOpen] = useState(true);
  const { machineServiceRecord, isHistorical } = useSelector((state) => state.machineServiceRecord);

  return (
    <>
            <Typography variant='h5'>
                <b>{`${index+1}). `}</b>{typeof value?.ListTitle === 'string' && value?.ListTitle || ''}{' ( Items: '}<b>{`${value?.checkItems?.length || 0}`}</b>{' ) '}
            </Typography>
            <Grid >
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {value?.checkItems?.map((childRow,childIndex) => (
                    <>
                    {/* {!isHistorical && childRow?.checkItemValue &&   */}
                      <StatusAndComment index={index} childIndex={childIndex} childRow={childRow}/>
                    {/* } */}
                    </>
                  ))}
                </TableBody>
              </Table>
            </Grid>   
    </>
  )
}
CollapsibleCheckedItemRow.propTypes = {
    index: PropTypes.number,
    value: PropTypes.object,
  };

export default memo(CollapsibleCheckedItemRow)