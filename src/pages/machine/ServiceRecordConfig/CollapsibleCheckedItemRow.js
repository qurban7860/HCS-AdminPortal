import { useState, memo } from 'react'
import PropTypes from 'prop-types';
import { Box, Card, Grid, Stack, Typography, Container, Autocomplete, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CardContent, Link, IconButton, Collapse } from '@mui/material';
import Iconify from '../../../components/iconify';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons'

const CollapsibleCheckedItemRow = ({value, index, toggleEdit, deleteIndex, handleListDragStart, handleListDrop }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
        <TableRow
                key={index}
                draggable
                onDragStart={(e) => handleListDragStart(e, index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleListDrop(e, index)}
              >
              <TableCell size='small' align='left' >
                <b>{`${index+1}). `}</b>{typeof value?.paramListTitle === 'string' && value?.paramListTitle || ''}{' (Checked Items: '}<b>{`${value?.paramList?.length}`}</b>{') '}
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
                  <ViewFormEditDeleteButtons handleEdit={()=>toggleEdit(index)} onDelete={()=>deleteIndex(index)} />
              </TableCell>
        </TableRow>
        <TableRow key={value._id}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Table size="small" aria-label="purchases">
                  {/* <TableHead>
                    <TableRow>
                      <TableCell>Item List</TableCell>
                    </TableRow>
                  </TableHead> */}
                  <TableBody>
                    {value?.paramList.map((childRow,childIndex) => (
                      <TableRow key={childRow._id}>
                        <TableCell component="th" scope="row"><b>{`${childIndex+1}). `}</b>{`${childRow.name}`}</TableCell>
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
CollapsibleCheckedItemRow.propTypes = {
    index: PropTypes.number,
    value: PropTypes.object,
    toggleEdit: PropTypes.func,
    deleteIndex: PropTypes.func,
    handleListDragStart: PropTypes.func,
    handleListDrop: PropTypes.func,
  };

export default memo(CollapsibleCheckedItemRow)