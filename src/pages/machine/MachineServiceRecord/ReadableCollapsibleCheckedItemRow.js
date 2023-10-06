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
  const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
  return (
    <>
            <Typography variant='h5'>
                <b>{`${index+1}). `}</b>{typeof value?.paramListTitle === 'string' && value?.paramListTitle || ''}{' ( Items: '}<b>{`${value?.paramList?.length}`}</b>{' ) '}
                {/* <IconButton
                  aria-label="expand row"
                  size="small"
                  color={open ? 'default' :  'primary'}
                  onClick={() => setOpen(!open)}
                >
                  {open ? <Iconify icon="mingcute:up-line" /> : <Iconify icon="mingcute:down-line" /> }
                </IconButton> */}
            </Typography>
            {/* <Collapse in={open} timeout="auto" unmountOnExit> */}
              <Grid sx={{ ml: 3 }}>
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    {value?.paramList.map((childRow,childIndex) => (
                      
                          <StatusAndComment index={index} childIndex={childIndex} childRow={childRow}/>
                    ))}
                  </TableBody>
                </Table>
              </Grid>   
            {/* </Collapse> */}
        </>
  )
}
CollapsibleCheckedItemRow.propTypes = {
    index: PropTypes.number,
    value: PropTypes.object,
  };

export default memo(CollapsibleCheckedItemRow)