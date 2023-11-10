import React, { useState, memo } from 'react'
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {  Grid, TextField, Autocomplete, Checkbox } from '@mui/material';
import Iconify from '../../../components/iconify';

const CommentsInput = ({ index, childIndex, childRow, checkParamList,
                    handleChangeCheckItemListValue, 
                    handleChangeCheckItemListDate,
                    handleChangeCheckItemListStatus,
                    handleChangeCheckItemListComment,
                    handleChangeCheckItemListChecked,
                    handleChangeCheckItemListCheckBoxValue
                }) => {
                    
    const { statusTypes } = useSelector((state) => state.serviceRecordConfig);
  return (
    <Grid sx={{display: 'flex', flexDirection: 'column'}}>
        <Grid  sx={{display: { md:'flex', xs: 'block', }, justifyContent:'end'}} >

                                <Checkbox 
                                    name={`${childRow?.name}_${childIndex}_${index}_${childIndex}`} 
                                    checked={checkParamList[index]?.checkItems[childIndex]?.checked || false} 
                                    onChange={()=>handleChangeCheckItemListChecked(index, childIndex )} 
                                    sx={{my:'auto', mr:'auto'}}
                                />

                            {childRow?.inputType === 'Short Text' && <TextField 
                                // fullWidth
                                type='text'
                                disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                                label={childRow?.inputType} 
                                name={`${childRow?.name}_${childIndex}_${index}`} 
                                onChange={(e) => handleChangeCheckItemListValue(index, childIndex, e.target.value)}
                                size="small" sx={{m:0.3, width: {sm: 259, xs: '100%'}}} 
                                value={checkParamList[index]?.checkItems[childIndex]?.checkItemValue}
                                required={childRow?.isRequired}
                                InputProps={{ inputProps: { maxLength: 50 }, 
                                    // style: { fontSize: '14px', height: 30 }
                                }}
                                // InputLabelProps={{ style: {  fontSize: '14px', top: '-4px' } }}
                            />}

                            { childRow?.inputType === 'Long Text' &&<TextField 
                                // fullWidth
                                type="text"
                                disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                                label={childRow?.inputType} 
                                name={`${childRow?.name}_${childIndex}_${index}`} 
                                onChange={(e) => handleChangeCheckItemListValue(index, childIndex, e.target.value)}
                                size="small" sx={{m:0.3, width: {sm: 259, xs: '100%'}}} 
                                value={checkParamList[index]?.checkItems[childIndex]?.checkItemValue}
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
                                disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                                value={checkParamList[index]?.checkItems[childIndex]?.checkItemValue}
                                onChange={(e) => {
                                    if (/^\d*$/.test(e.target.value)) {
                                    handleChangeCheckItemListValue(index, childIndex, e.target.value)
                                    }else{
                                        handleChangeCheckItemListValue(index, childIndex, checkParamList[index]?.checkItems[childIndex].value)
                                    }}
                                } 
                                size="small" sx={{m:0.3, width: {sm: 259, xs: '100%'}}} 
                                required={childRow?.isRequired}
                                // InputProps={{ style: { fontSize: '14px', height: 30 }}}
                                // InputLabelProps={{ style: {  fontSize: '14px', top: '-4px' } }}
                            />}

                                {childRow?.inputType === 'Boolean' && 
                            <div style={{my:'auto',width: 259}}>
                                <Checkbox 
                                    disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                                    name={`${childRow?.name}_${childIndex}_${index}`} 
                                    checked={checkParamList[index]?.checkItems[childIndex]?.checkItemValue || false} 
                                    onChange={()=>handleChangeCheckItemListCheckBoxValue(index, childIndex )} 
                                    sx={{my:'auto'}}
                                    />
                            </div>}

                            { childRow?.inputType === 'Date'  && 
                            <TextField 
                                // fullWidth
                                id="date"
                                label='Date'
                                name={childRow?.name} 
                                type="date"
                                format="dd/mm/yyyy"
                                disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                                value={checkParamList[index]?.checkItems[childIndex]?.checkItemValue || null}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) =>  handleChangeCheckItemListDate(index, childIndex, e.target.value) } 
                                size="small" sx={{m:0.3, ml:'auto', width: {sm: 259, xs: '100%'}}} 
                                required={childRow?.isRequired}
                            /> }

                            { childRow?.inputType === 'Status' && <Autocomplete 
                                disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                                value={checkParamList[index]?.checkItems[childIndex]?.checkItemValue  }
                                options={statusTypes}
                                // isOptionEqualToValue={(option, value) => option === value}
                                onChange={(event, newInputValue) =>  handleChangeCheckItemListStatus(index, childIndex, newInputValue) }
                                renderInput={(params) => <TextField {...params} label="Status" size='small' 
                                // InputProps={{ style: { fontSize: '14px !important', height: '30 !important' }}}
                                // InputLabelProps={{ style: {  fontSize: '14px', top: '-4px' } }}
                                />}
                                // InputLabelProps={{ style: {  fontSize: '14px', top: '-4px' } }}
                                sx={{ width: {sm: 259, xs: '100%'}, m:0.3, ml:{sm: 'auto',md: 0},
                                    // "& .MuiInputBase-root": { height: "30px", fontSize: '14px' },
                                }}
                            /> }
                        </Grid>
    </Grid>
    )
}

CommentsInput.propTypes = {
    index: PropTypes.number,
    childIndex: PropTypes.number,
    checkParamList: PropTypes.array,
    childRow: PropTypes.object,
    handleChangeCheckItemListDate: PropTypes.func,
    handleChangeCheckItemListValue: PropTypes.func,
    handleChangeCheckItemListStatus: PropTypes.func,
    handleChangeCheckItemListComment: PropTypes.func,
    handleChangeCheckItemListChecked: PropTypes.func,
    handleChangeCheckItemListCheckBoxValue: PropTypes.func,
  };
export default memo(CommentsInput)