import { useState, memo } from 'react'
import PropTypes from 'prop-types';
import { Box, Table, TableBody, TableCell, TableRow,  IconButton, Collapse, Checkbox } from '@mui/material';
import Iconify from '../../../components/iconify';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons'
import {  RHFTextField } from '../../../components/hook-form';

const CollapsibleCheckedItemInputRow = ({value, index, toggleEdit, deleteIndex, handleListDragStart, handleListDrop }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
        <TableRow
                key={index}
                draggable
                onDragStart={handleListDragStart && ((e) => handleListDragStart(e, index))}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleListDrop && ((e) => handleListDrop(e, index))}
              >
              <TableCell size='small' align='left' >
                <b>{`${index+1}). `}</b>{typeof value?.paramListTitle === 'string' && value?.paramListTitle || ''}{' ( Items: '}<b>{`${value?.paramList?.length}`}</b>{' ) '}
                <IconButton
                  aria-label="expand row"
                  size="small"
                  color={open ? 'default' :  'primary'}
                  onClick={() => setOpen(!open)}
                >
                  {open ? <Iconify icon="mingcute:up-line" /> : <Iconify icon="mingcute:down-line" /> }
                </IconButton>
                </TableCell>
              <TableCell size='small' align='right' >
                  {toggleEdit && <ViewFormEditDeleteButtons handleEdit={()=>toggleEdit(index)} onDelete={()=>deleteIndex(index)} /> }
              </TableCell>
        </TableRow>
        <TableRow key={value._id}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">

                  <TableBody>
                    {value?.paramList.map((childRow,childIndex) => (
                      <TableRow key={childRow._id} >
                        <TableCell component="th" scope="row" >
                        <b>{`${childIndex+1}). `}</b>
                        {`${childRow.name}`}
                        </TableCell>
                        {( childRow?.inputType === 'String' || childRow?.inputType === 'Number' ) && <RHFTextField label={childRow?.inputType} name={childRow.name} size="small" sx={{m:0.3}} />}
                        {childRow?.inputType === 'Boolean' && <Checkbox  />}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>   
            </Collapse>
          </TableCell>
        </TableRow>
        </>
  )
}
CollapsibleCheckedItemInputRow.propTypes = {
    index: PropTypes.number,
    value: PropTypes.object,
    toggleEdit: PropTypes.func,
    deleteIndex: PropTypes.func,
    handleListDragStart: PropTypes.func,
    handleListDrop: PropTypes.func,
  };

export default memo(CollapsibleCheckedItemInputRow)