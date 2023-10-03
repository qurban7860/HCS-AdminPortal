import { useState, memo } from 'react'
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { Box, Grid, Table, TableBody, TableCell, TableRow,  IconButton, Collapse, Typography, Checkbox, Chip } from '@mui/material';
import Iconify from '../../../components/iconify';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons'

const CollapsibleCheckedItemRow = ({value, index, toggleEdit, deleteIndex, handleListDragStart, handleListDrop }) => {
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
                      <TableRow key={childRow._id} sx={{":hover": {
                        backgroundColor: "#dbdbdb66"
                      }
                      }}>
                        <TableCell component="th" scope="row"><b>{`${childIndex+1}). `}</b>{`${childRow.name} ${childRow?.inputType ? '-' : '' } ${childRow?.inputType ? childRow?.inputType : '' }`}</TableCell>
                        <TableCell align='right' >
                          <Grid  sx={{display: { md:'flex', xs: 'block', }, justifyContent:'end'}}>
                          {childRow?.inputType === 'Boolean' ? 
                        <Checkbox  checked={
                          machineServiceRecord?.checkParams?.find((element) =>
                          element?.paramListTitle === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramListTitle && element?.serviceParam === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramList[childIndex]?._id
                          )?.value || false
                          } disabled sx={{ml:'auto', my:-0.9}} /> 
                          :
                        <Typography variant="body2" sx={{pr:1.5}}>
                        {machineServiceRecord?.checkParams?.find((element) =>
                          element?.paramListTitle === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramListTitle && element?.serviceParam === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramList[childIndex]?._id
                          )?.value }
                        </Typography> }
                        
                        <Grid sx={{width: 85 }}>
                          {machineServiceRecord?.checkParams?.find((element) =>
                          element?.paramListTitle === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramListTitle && element?.serviceParam === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramList[childIndex]?._id
                          )?.status && <Chip size="small" label={machineServiceRecord?.checkParams?.find((element) =>
                          element?.paramListTitle === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramListTitle && element?.serviceParam === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramList[childIndex]?._id
                          )?.status} /> }
                        </Grid>

                          </Grid>
                        </TableCell>
                      </TableRow>
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
    toggleEdit: PropTypes.func,
    deleteIndex: PropTypes.func,
    handleListDragStart: PropTypes.func,
    handleListDrop: PropTypes.func,
  };

export default memo(CollapsibleCheckedItemRow)