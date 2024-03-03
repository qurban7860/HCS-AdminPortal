import { memo, useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Stack, Box, TextField, Autocomplete, Checkbox, FormControlLabel, FormGroup, Typography, Grid } from '@mui/material';
import { statusTypes } from '../util/index'

const CommentsInput = ({ index, childIndex, childRow, checkParamList,
                    isChecked,
                    callCheckedValue,
                    handleChangeCheckItemListValue, 
                    handleChangeCheckItemListDate,
                    handleChangeCheckItemListStatus,
                    handleChangeCheckItemListComment,
                    handleChangeCheckItemListChecked,
                    handleChangeCheckItemListCheckBoxValue
                }) =>  {

    const [ isValueAvailable, setIsValueAvailable ] = useState(false);

useEffect(()=>{
    if((childRow?.inputType === 'Status' || childRow?.inputType === 'Date' || childRow?.inputType === 'Boolean' )
        && checkParamList[index]?.checkItems[childIndex]?.checkItemValue ){
            setIsValueAvailable(true);
            if(!checkParamList[index]?.checkItems[childIndex]?.checked){
                callCheckedValue()
            }
    }else if (( childRow?.inputType === 'Status' || childRow?.inputType === 'Date' || childRow?.inputType === 'Boolean' ) && 
                checkParamList[index]?.checkItems[childIndex]?.checkItemValue !== undefined && 
                !checkParamList[index]?.checkItems[childIndex]?.checkItemValue ){
                    setIsValueAvailable(false);
                    if(checkParamList[index]?.checkItems[childIndex]?.checked){
                        callCheckedValue()
                    }
    } else if(( childRow?.inputType === 'Short Text' || childRow?.inputType === 'Long Text' || childRow?.inputType === 'Number' ) && 
                checkParamList[index]?.checkItems[childIndex]?.checkItemValue?.trim() ){
                    setIsValueAvailable(true);
                    if(!checkParamList[index]?.checkItems[childIndex]?.checked){
                        callCheckedValue()
                    }
    } else if(( childRow?.inputType === 'Short Text' || childRow?.inputType === 'Long Text' || childRow?.inputType === 'Number' ) && 
                checkParamList[index]?.checkItems[childIndex]?.checkItemValue !== undefined && 
                !checkParamList[index]?.checkItems[childIndex]?.checkItemValue?.trim() ){
                    setIsValueAvailable(false);
                    if(checkParamList[index]?.checkItems[childIndex]?.checked){
                        callCheckedValue()
                    }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
},[ checkParamList[index]?.checkItems[childIndex]?.checkItemValue ])

    return (<>
    <Stack spacing={1} >
                <Grid display="flex" alignItems="center">
                    <Typography variant='body2' size='small'  >
                        <b>{`${index+1}.${childIndex+1}. `}</b>{`${childRow.name}`}
                    </Typography>
                    <Checkbox 
                        name={`${childRow?.name}_${childIndex}_${index}_${childIndex}`} 
                        checked={checkParamList[index]?.checkItems[childIndex]?.checked || false } 
                        onChange={()=>handleChangeCheckItemListChecked(index, childIndex )} 
                    /> 
                    {!checkParamList[index]?.checkItems[childIndex]?.checked && isValueAvailable &&
                        <Typography variant='body2' size='small' sx={{ color: 'red'}}  >Please tick this box to save values</Typography>
                    }
                </Grid>
            {childRow?.inputType === 'Short Text' && <TextField 
                // name={`${index}${childIndex}`} 
                type='text'
                // disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                label={childRow?.inputType} 
                name={`${childRow?.name}_${childIndex}_${index}`} 
                onChange={(e) => handleChangeCheckItemListValue(index, childIndex, e.target.value)}
                size="small" sx={{ width: '100%' }} 
                value={checkParamList[index]?.checkItems[childIndex]?.checkItemValue}
                required={childRow?.isRequired}
                InputProps={{ inputProps: { maxLength: 200 } }}
                InputLabelProps={{ shrink: checkParamList[index]?.checkItems[childIndex]?.checked || checkParamList[index]?.checkItems[childIndex]?.checkItemValue}}
            />}

            { childRow?.inputType === 'Long Text' &&<TextField 
                type="text"
                // disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                label={childRow?.inputType} 
                name={`${childRow?.name}_${childIndex}_${index}`} 
                onChange={(e) => handleChangeCheckItemListValue(index, childIndex, e.target.value)}
                size="small" sx={{ width: '100%'}} 
                value={checkParamList[index]?.checkItems[childIndex]?.checkItemValue}
                minRows={1} multiline
                required={childRow?.isRequired}
                InputProps={{ inputProps: { maxLength: 3000 } }}
                InputLabelProps={{ shrink: checkParamList[index]?.checkItems[childIndex]?.checked || checkParamList[index]?.checkItems[childIndex]?.checkItemValue}}
            />}

            </Stack>
                {childRow?.inputType === 'Boolean' && 
            <FormGroup >
                <FormControlLabel control={
                <Checkbox 
                    // disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                    checked={checkParamList[index]?.checkItems[childIndex]?.checkItemValue === 'true' || checkParamList[index]?.checkItems[childIndex]?.checkItemValue === true } 
                    onChange={()=>handleChangeCheckItemListCheckBoxValue(index, childIndex )} 
                    />
                } label="Check" />
            </FormGroup>
            }

            <Stack spacing={1} >

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
                        // label='Date'
                        name={childRow?.name} 
                        type="date"
                        format="dd/mm/yyyy"
                        // disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                        value={checkParamList[index]?.checkItems[childIndex]?.checkItemValue || null}
                        onChange={(e) =>  handleChangeCheckItemListDate(index, childIndex, e.target.value) } 
                        size="small" 
                        required={childRow?.isRequired}
                        // InputLabelProps={{ shrink: checkParamList[index]?.checkItems[childIndex]?.checked || checkParamList[index]?.checkItems[childIndex]?.checkItemValue }}
                    /> }

                    { childRow?.inputType === 'Number'  && 
                    <TextField 
                        id="outlined-number"
                        label={`${childRow?.unitType ? childRow?.unitType : 'Enter Value'}`}
                        name={childRow?.name} 
                        type="number"
                        // disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                        value={checkParamList[index]?.checkItems[childIndex]?.checkItemValue}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            if (/^\d*$/.test(inputValue)) {
                                handleChangeCheckItemListValue(index, childIndex, inputValue);
                            }
                        }} 
                        onKeyDown={(e) => {
                            if (e.key === 'Backspace') {
                                return;
                            }
                            if (!/^\d*$/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                        size="small" 
                        required={childRow?.isRequired}
                        InputLabelProps={{ shrink: checkParamList[index]?.checkItems[childIndex]?.checked || checkParamList[index]?.checkItems[childIndex]?.checkItemValue }}
                    />
                    }

                    { childRow?.inputType === 'Status' && <Autocomplete
                        // disabled={!checkParamList[index]?.checkItems[childIndex]?.checked}
                        options={statusTypes}
                        value={checkParamList[index]?.checkItems[childIndex]?.checkItemValue || null }
                        isOptionEqualToValue={(option, value) => option?.name === value?.name}
                        getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                        onChange={ async (event, newInputValue) => { 
                            if(newInputValue){
                                await handleChangeCheckItemListStatus(index, childIndex, newInputValue); 
                                // await changeFieldStatus();  
                            }else{
                                handleChangeCheckItemListStatus(index, childIndex, null ); 
                            }
                            }}
                        renderInput={(params) => <TextField {...params} label="Status" size='small' />}
                    /> }
            </Box>
    </Stack>
    </>
    )};

CommentsInput.propTypes = {
    index: PropTypes.number,
    childIndex: PropTypes.number,
    checkParamList: PropTypes.array,
    childRow: PropTypes.object,
    callCheckedValue: PropTypes.func,
    isChecked: PropTypes.bool,
    handleChangeCheckItemListDate: PropTypes.func,
    handleChangeCheckItemListValue: PropTypes.func,
    handleChangeCheckItemListStatus: PropTypes.func,
    handleChangeCheckItemListComment: PropTypes.func,
    handleChangeCheckItemListChecked: PropTypes.func,
    handleChangeCheckItemListCheckBoxValue: PropTypes.func,
};


export default memo(CommentsInput)