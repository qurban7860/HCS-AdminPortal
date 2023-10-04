import { useState, memo } from 'react'
import PropTypes, { number } from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { Box, Table, TableBody, TableCell, TableRow,  IconButton, Collapse, Grid, TextField, Checkbox, Typography, Autocomplete } from '@mui/material';
import Iconify from '../../../components/iconify';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import {  RHFTextField, RHFCheckbox, RHFDatePicker, RHFAutocomplete } from '../../../components/hook-form';
import CommentsInput from './CommentsInput';

const CollapsibleCheckedItemInputRow = ({ row, index, checkParamList, setValue, 
  handleChangeCheckItemListValue, 
  handleChangeCheckItemListStatus,
  handleChangeCheckItemListComment,
  handleChangeCheckItemListNumberValue,
  handleChangeCheckItemListCheckBoxValue}) =>{
  const [ commentVisibility, setCommentVisibility ] = useState(false)
  const handleCommentVisibility = (Index, childIndex)=>{

    if(`${index}${childIndex}` !== commentVisibility ){
      setCommentVisibility(`${Index}${childIndex}`)
    }else{
        setCommentVisibility(false)
    }
  }
  return (
    <>
        <Typography key={index} variant='h5'>
            <b>{`${index+1}). `}</b>{typeof row?.paramListTitle === 'string' && row?.paramListTitle || ''}{' ( Items: '}<b>{`${row?.paramList?.length}`}</b>{' ) '}
        </Typography>
        <Grid  sx={{ml:3}} >
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    {row?.paramList.map((childRow,childIndex) => (
                      <TableRow key={childRow._id} 
                      sx={{ ":hover": { backgroundColor: "#dbdbdb66" } }}
                      >
                        <TableCell component="th" size='small'>
                          <b>{`${childIndex+1}). `}</b>
                          {`${childRow.name}`}
                        </TableCell>
                        <TableCell align='right' >
                                <CommentsInput index={index} childIndex={childIndex} 
                                childRow={childRow}
                                    checkParamList={checkParamList} 
                                    handleChangeCheckItemListComment={handleChangeCheckItemListComment} 
                                />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
        </Grid>
        </>
  )
}
CollapsibleCheckedItemInputRow.propTypes = {
    index: PropTypes.number,
    row: PropTypes.object,
    checkParamList: PropTypes.array,
    handleChangeCheckItemListValue: PropTypes.func,
    handleChangeCheckItemListStatus: PropTypes.func,
    handleChangeCheckItemListComment: PropTypes.func,
    handleChangeCheckItemListNumberValue: PropTypes.func,
    handleChangeCheckItemListCheckBoxValue: PropTypes.func,
    setValue: PropTypes.func,
  };

export default CollapsibleCheckedItemInputRow