import { useState, memo } from 'react'
import PropTypes, { number } from 'prop-types';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Box, Table, TableBody, TableCell, TableRow,  IconButton, Collapse, Grid, TextField, Checkbox, Typography, Autocomplete } from '@mui/material';
import Iconify from '../../../components/iconify';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons'
import {  RHFTextField, RHFCheckbox, RHFDatePicker, RHFAutocomplete } from '../../../components/hook-form';


const CollapsibleCheckedItemInputRow = ({ row, index, checkParamList, setValue, 
  handleChangeCheckItemListValue, 
  handleChangeCheckItemListStatus,
  handleChangeCheckItemListComment,
  handleChangeCheckItemListNumberValue,
  handleChangeCheckItemListCheckBoxValue}) =>{
  const { statusTypes } = useSelector((state) => state.serviceRecordConfig);
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
                        <Grid  sx={{display: { md:'flex', xs: 'block', }, justifyContent:'end'}}>
                              {childRow?.inputType === 'Short Text' && <TextField 
                                // fullWidth
                                type='text'
                                label={childRow?.inputType} 
                                name={`${childRow?.name}_${childIndex}_${index}`} 
                                onChange={(e) => handleChangeCheckItemListValue(index, childIndex, e)}
                                size="small" sx={{m:0.3}} 
                                value={checkParamList[index]?.paramList[childIndex]?.value}
                                required={childRow?.isRequired}
                                InputProps={{ inputProps: { maxLength:50 } }}
                              />}

                              { childRow?.inputType === 'Long Text' &&<TextField 
                                // fullWidth
                                type="text"
                                label={childRow?.inputType} 
                                name={`${childRow?.name}_${childIndex}_${index}`} 
                                onChange={(e) => handleChangeCheckItemListValue(index, childIndex, e)}
                                size="small" sx={{m:0.3}} 
                                value={checkParamList[index]?.paramList[childIndex]?.value}
                                minRows={3} multiline
                                required={childRow?.isRequired}
                                InputProps={{ inputProps: { maxLength: 200 } }}
                              />}

                              { childRow?.inputType === 'Number'  && 
                              <TextField 
                                // fullWidth
                                id="outlined-number"
                                label={`${childRow?.unitType ? childRow?.unitType :'Enter Value'}`}
                                name={childRow?.name} 
                                type="number"
                                value={checkParamList[index]?.paramList[childIndex]?.value}
                                onChange={(e) => {
                                  if (/^\d*$/.test(e.target.value)) {
                                    handleChangeCheckItemListNumberValue(index, childIndex, e.target.value)
                                    }else{
                                      handleChangeCheckItemListNumberValue(index, childIndex, checkParamList[index]?.paramList[childIndex].value)
                                    }
                                  }
                                } 
                                size="small" sx={{m:0.3}} 
                                required={childRow?.isRequired}
                              />}

                              <div>
                              {childRow?.inputType === 'Boolean' && 
                              <Checkbox 
                                name={`${childRow?.name}_${childIndex}_${index}`} 
                                checked={checkParamList[index].paramList[childIndex]?.value || false} 
                                onChange={(val)=>handleChangeCheckItemListCheckBoxValue(index, childIndex, val)} 
                              />}
                              </div>

                              <Autocomplete 
                                value={checkParamList[index].paramList[childIndex]?.status || null }
                                options={statusTypes}
                                getOptionLabel={(option) => option?.name || ''}
                                onChange={(event, newInputValue) =>  handleChangeCheckItemListStatus(index, childIndex, newInputValue) }
                                renderInput={(params) => <TextField {...params} label="Status" size="small" />}
                                sx={{ minWidth: 180,maxWidth: 255, m:0.3, ml:{sm: 'auto',md: 0}}}
                              />
                                <Iconify
                                  onClick={()=> handleCommentVisibility(index, childIndex)}
                                  icon="mdi:comments-outline"
                                  sx={{ cursor: 'pointer', mt:1.7, mx:0.7 }}
                                />
                              </Grid>

                                { commentVisibility === `${index}${childIndex}` &&<TextField 
                                // fullWidth
                                type="text"
                                label="Comment" 
                                name="comment"
                                onChange={(e) => handleChangeCheckItemListComment(index, childIndex, e)}
                                size="small" sx={{m:0.3,ml:{sm: 'auto'}, minWidth:180, pr:{md:4},width: {md: 470 }  }} 
                                value={checkParamList[index]?.paramList[childIndex]?.comment}
                                minRows={3} multiline
                                InputProps={{ inputProps: { maxLength: 200 } }}
                              />}

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