import React, { useState, memo } from 'react'
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {  Grid, Stack, Box, TextField, Autocomplete, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import Iconify from '../../../components/iconify';
import ViewFormServiceRecordVersionAudit from '../../components/ViewForms/ViewFormServiceRecordVersionAudit';

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
    <Stack spacing={1} >
            {childRow?.inputType === 'Short Text' && <TextField 
                // fullWidth
                type='text'
                disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                label={childRow?.inputType} 
                name={`${childRow?.name}_${childIndex}_${index}`} 
                onChange={(e) => handleChangeCheckItemListValue(index, childIndex, e.target.value)}
                size="small" sx={{ width: '100%' }} 
                value={checkParamList[index]?.checkItems[childIndex]?.checkItemValue}
                required={childRow?.isRequired}
                InputProps={{ inputProps: { maxLength: 200 }, 
                }}
            />}
            { childRow?.inputType === 'Long Text' &&<TextField 
                // fullWidth
                type="text"
                disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                label={childRow?.inputType} 
                name={`${childRow?.name}_${childIndex}_${index}`} 
                onChange={(e) => handleChangeCheckItemListValue(index, childIndex, e.target.value)}
                size="small" sx={{ width: '100%'}} 
                value={checkParamList[index]?.checkItems[childIndex]?.checkItemValue}
                minRows={1} multiline
                required={childRow?.isRequired}
                InputProps={{ inputProps: { maxLength: 3000 }, 
                }}
            />}

                {childRow?.inputType === 'Boolean' && 
            
            <FormGroup sx={{my:'auto',ml:1 }}>
                <FormControlLabel control={
                    <div >
                <Checkbox 
                    disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                    label="Check"
                    icon={<Iconify
                        color={( checkParamList[index]?.checkItems[childIndex]?.checkItemValue === true || checkParamList[index]?.checkItems[childIndex]?.checkItemValue  === 'true') && '#008000' } 
                        icon={ ( checkParamList[index]?.checkItems[childIndex]?.checkItemValue === true || checkParamList[index]?.checkItems[childIndex]?.checkItemValue  === 'true') && 'ph:check-square-bold'  } />}
                    checkedIcon={<Iconify
                        color={checkParamList[index]?.checkItems[childIndex]?.checkItemValue === true || checkParamList[index]?.checkItems[childIndex]?.checkItemValue  === 'true' ? '#008000' : '#FF0000'} 
                        icon={ checkParamList[index]?.checkItems[childIndex]?.checkItemValue === true || checkParamList[index]?.checkItems[childIndex]?.checkItemValue  === 'true' ? 'ph:check-square-bold' : 'charm:square-cross' } />}
                    name={`${childRow?.name}_${childIndex}_${index}`} 
                    checked={checkParamList[index]?.checkItems[childIndex]?.checkItemValue === 'true' || checkParamList[index]?.checkItems[childIndex]?.checkItemValue === true } 
                    onChange={()=>handleChangeCheckItemListCheckBoxValue(index, childIndex )} 
                    sx={{my:'auto'}}
                    />
                    </div>
                } label="Check" />
            </FormGroup>
            }


            <Box
                rowGap={1}
                columnGap={1}
                display="grid"
                sx={{my:1}}
                gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
            >
                    { childRow?.inputType === 'Date'  && 
                    <TextField 
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
                        size="small" 
                        required={childRow?.isRequired}
                    /> }

                    { childRow?.inputType === 'Number'  && 
                    <TextField 
                        // fullWidth
                        id="outlined-number"
                        label={`${childRow?.unitType ? childRow?.unitType :'Enter Value'}`}
                        name={childRow?.name} 
                        type="number"
                        disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                        value={checkParamList[index]?.checkItems[childIndex]?.checkItemValue}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => {
                            if (/^\d*$/.test(e.target.value)) {
                            handleChangeCheckItemListValue(index, childIndex, e.target.value)
                            }else{
                                handleChangeCheckItemListValue(index, childIndex, checkParamList[index]?.checkItems[childIndex].value)
                            }}
                        } 
                        size="small" 
                        required={childRow?.isRequired}
                    />}

                    { childRow?.inputType === 'Status' && <Autocomplete 
                        disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                        value={checkParamList[index]?.checkItems[childIndex]?.checkItemValue  }
                        options={statusTypes}
                        onChange={(event, newInputValue) =>  handleChangeCheckItemListStatus(index, childIndex, newInputValue) }
                        renderInput={(params) => <TextField {...params} label="Status" size='small' 
                        />}

                    /> }
            </Box>
    </Stack>
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