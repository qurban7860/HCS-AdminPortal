import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {  Grid, TextField, Autocomplete, Checkbox } from '@mui/material';
import Iconify from '../../../components/iconify';

const CommentsInput = ({ index, childIndex, childRow, checkParamList,
                    handleChangeCheckItemListValue, 
                    handleChangeCheckItemListStatus,
                    handleChangeCheckItemListComment,
                    handleChangeCheckItemListCheckBoxValue
                }) => {
    const [isOpen, setOpen] = useState(false)
    const { statusTypes } = useSelector((state) => state.serviceRecordConfig);


  return (
    <Grid sx={{display: 'flex', flexDirection: 'column'}}>
        <Grid  sx={{display: { md:'flex', xs: 'block', }, justifyContent:'end'}}>
                            {childRow?.inputType === 'Short Text' && <TextField 
                                // fullWidth
                                type='text'
                                label={childRow?.inputType} 
                                name={`${childRow?.name}_${childIndex}_${index}`} 
                                onChange={(e) => handleChangeCheckItemListValue(index, childIndex, e.target.value)}
                                size="small" sx={{m:0.3}} 
                                value={checkParamList[index]?.paramList[childIndex]?.value}
                                required={childRow?.isRequired}
                                InputProps={{ inputProps: { maxLength: 50 }, 
                                    // style: { fontSize: '14px', height: 30 }
                                }}
                                // InputLabelProps={{ style: {  fontSize: '14px', top: '-4px' } }}
                            />}

                            { childRow?.inputType === 'Long Text' &&<TextField 
                                // fullWidth
                                type="text"
                                label={childRow?.inputType} 
                                name={`${childRow?.name}_${childIndex}_${index}`} 
                                onChange={(e) => handleChangeCheckItemListValue(index, childIndex, e.target.value)}
                                size="small" sx={{m:0.3}} 
                                value={checkParamList[index]?.paramList[childIndex]?.value}
                                minRows={1} multiline
                                required={childRow?.isRequired}
                                InputProps={{ inputProps: { maxLength: 200 }, 
                                // style: { fontSize: '14px', height: 30 }
                                }}
                                // InputLabelProps={{ style: {  fontSize: '14px', top: '-4px' } }}
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
                                    handleChangeCheckItemListValue(index, childIndex, e.target.value)
                                    }else{
                                        handleChangeCheckItemListValue(index, childIndex, checkParamList[index]?.paramList[childIndex].value)
                                    }}
                                } 
                                size="small" sx={{m:0.3}} 
                                required={childRow?.isRequired}
                                // InputProps={{ style: { fontSize: '14px', height: 30 }}}
                                // InputLabelProps={{ style: {  fontSize: '14px', top: '-4px' } }}
                            />}

                            <div>
                            {childRow?.inputType === 'Boolean' && 
                            <Checkbox 
                                name={`${childRow?.name}_${childIndex}_${index}`} 
                                checked={checkParamList[index].paramList[childIndex]?.value || false} 
                                onChange={()=>handleChangeCheckItemListCheckBoxValue(index, childIndex )} 
                            />}
                            </div>

                            <Autocomplete 
                                value={checkParamList[index].paramList[childIndex]?.status || null }
                                options={statusTypes}
                                getOptionLabel={(option) => option?.name || ''}
                                isOptionEqualToValue={(option, value) => option._id === value._id}
                                onChange={(event, newInputValue) =>  handleChangeCheckItemListStatus(index, childIndex, newInputValue) }
                                renderInput={(params) => <TextField {...params} label="Status" size='small' 
                                // InputProps={{ style: { fontSize: '14px !important', height: '30 !important' }}}
                                // InputLabelProps={{ style: {  fontSize: '14px', top: '-4px' } }}
                                />}
                                // InputLabelProps={{ style: {  fontSize: '14px', top: '-4px' } }}
                                sx={{ minWidth: 180,maxWidth: 255, m:0.3, ml:{sm: 'auto',md: 0},
                                    // "& .MuiInputBase-root": { height: "30px", fontSize: '14px' },
                                }}
                                
                            />

                            <TextField 
                                // fullWidth
                                type="text"
                                label="Comment" 
                                name="comment"
                                onChange={(e) => handleChangeCheckItemListComment(index, childIndex, e.target.value)}
                                size="small" sx={{ m:0.3, ml:{sm: 'auto',md: 0}, minWidth:180 }} 
                                // pr:{md:4},width: {md: 470 } 
                                value={checkParamList[index]?.paramList[childIndex]?.comments}
                                minRows={1} multiline
                                InputProps={{ inputProps: { maxLength: 500 }, 
                                // style: { fontSize: '14px', height: 30 }
                                }}
                                // InputLabelProps={{ style: {  fontSize: '14px', top: '-4px' } }}
                                
                            />
                                {/* <Iconify
                                    onClick={()=> setOpen(!isOpen)}
                                    icon={isOpen ? 'mdi:comment-remove-outline' : 'mdi:comment-text-outline' }
                                    sx={{ cursor: 'pointer', mt:1.7, mx:0.7 }}
                                /> */}
                            </Grid>
            
        {/* { isOpen &&  */}

        {/* } */}
    </Grid>
  )
}

CommentsInput.propTypes = {
    index: PropTypes.number,
    childIndex: PropTypes.number,
    checkParamList: PropTypes.array,
    childRow: PropTypes.object,
    handleChangeCheckItemListValue: PropTypes.func,
    handleChangeCheckItemListStatus: PropTypes.func,
    handleChangeCheckItemListComment: PropTypes.func,
    handleChangeCheckItemListCheckBoxValue: PropTypes.func,
  };
export default CommentsInput