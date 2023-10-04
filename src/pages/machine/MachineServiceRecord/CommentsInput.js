import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {  Grid, TextField, Autocomplete, Checkbox } from '@mui/material';
import Iconify from '../../../components/iconify';

const CommentsInput = ({ index, childIndex, childRow, checkParamList,
                    handleChangeCheckItemListValue, 
                    handleChangeCheckItemListStatus,
                    handleChangeCheckItemListComment,
                    handleChangeCheckItemListNumberValue,
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
                                    }}
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
                                    onClick={()=> setOpen(!isOpen)}
                                    icon={isOpen ? 'mdi:comment-remove-outline' : 'mdi:comment-text-outline' }
                                    sx={{ cursor: 'pointer', mt:1.7, mx:0.7 }}
                                />
                            </Grid>
            
        { isOpen && <TextField 
            // fullWidth
            type="text"
            label="Comment" 
            name="comment"
            onChange={(e) => handleChangeCheckItemListComment(index, childIndex, e.target.value)}
            size="small" sx={{m:0.3,ml:'auto', minWidth:180, width: {md: 470 } }} 
            // pr:{md:4},width: {md: 470 } 
            value={checkParamList[index]?.paramList[childIndex]?.comments}
            minRows={3} multiline
            InputProps={{ inputProps: { maxLength: 200 } }}
        />}
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
    handleChangeCheckItemListNumberValue: PropTypes.func,
    handleChangeCheckItemListCheckBoxValue: PropTypes.func,
  };
export default CommentsInput