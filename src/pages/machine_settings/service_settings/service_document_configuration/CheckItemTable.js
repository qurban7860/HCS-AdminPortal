import { memo, useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Grid, Stack, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { getActiveCheckItems } from '../../../../redux/slices/products/machineCheckItems';
import { RHFTextField, RHFAutocomplete} from '../../../../components/hook-form';
import useResponsive from '../../../../hooks/useResponsive';
import { useSnackbar } from '../../../../components/snackbar';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';
import CollapsibleCheckedItemRow from './CollapsibleCheckedItemRow'

const CheckItemTable = ({ checkParams, setCheckParams, checkItemList, setCheckItemList, ListTitle, setValue, checkItemCategory }) => {
  
    const isMobile = useResponsive('down', 'sm');
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const { serviceRecordConfig } = useSelector((state) => state.serviceRecordConfig);
    const { activeServiceCategories } = useSelector((state) => state.serviceCategory);
    const { activeCheckItems } = useSelector((state) => state.checkItems);
    const [checkParamNumber, setCheckParamNumber]= useState(serviceRecordConfig?.checkItemLists?.length || 0);
    const [checkItemListTitleError, setItemListTitleError] = useState('');
    const [checkItemListError, setItemListError] = useState('');
    // const [checkItemListButtonVariant, setCheckItemListButtonVariant] = useState('contained');
    // const [checkItemListButtoncolor, setCheckItemListButtoncolor] = useState('primary');

      const handleInputChange = (value) => {
        if (value) {
          setCheckItemList((checkItems) => [...checkItems, value[value.length - 1]]);
        }
      };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };

  useEffect(()=>{
    dispatch(getActiveCheckItems());
  },[ dispatch ])

  const handleListDrop = (e, index) => {
    const draggedIndex = e.dataTransfer.getData('index');
    const updatedCheckParam = [...checkParams];
    const [draggedRow] = updatedCheckParam.splice(draggedIndex, 1);
    updatedCheckParam.splice(index, 0, draggedRow);
    setCheckParams(updatedCheckParam); 
    if(draggedIndex > checkParamNumber && index <= checkParamNumber ){
      setCheckParamNumber(prevCheckParamNumber => prevCheckParamNumber + 1)
    }else if(draggedIndex < checkParamNumber && index >= checkParamNumber){
      setCheckParamNumber(prevCheckParamNumber => prevCheckParamNumber - 1)
    }else if(Number(draggedIndex) === checkParamNumber && index > checkParamNumber){
      setCheckParamNumber(prevCheckParamNumber => prevCheckParamNumber + 1)
    }else if(Number(draggedIndex) === checkParamNumber && index < checkParamNumber){
      setCheckParamNumber(prevCheckParamNumber => prevCheckParamNumber - 1)
    }
  };

  const handleListDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };

  const handleDrop = (e, index) => {
    const draggedIndex = e.dataTransfer.getData('index');
    const updatedCheckParam = [...checkItemList];
    const [draggedRow] = updatedCheckParam.splice(draggedIndex, 1);
    updatedCheckParam.splice(index, 0, draggedRow);
    setCheckItemList(updatedCheckParam); 
  };

  const handleRowDelete = (indexToRemove) => {
    try {
      const newArray =  checkItemList.filter((_, index) => index !== indexToRemove);
      setCheckItemList(newArray);
      enqueueSnackbar('Check Item deleted successfully!');
    } catch (err) {
      enqueueSnackbar('Check Item Delete failed!', { variant: 'error' });
      console.error(err.message);
    }
  };

  const toggleEdit = (index) => {setCheckItemList(checkParams[index]?.checkItems); setCheckParamNumber(index); setValue('ListTitle',checkParams[index]?.ListTitle) };

  const deleteIndex = (indexToRemove) => {
    try {
      const newArray =  checkParams.filter((_, index) => index !== indexToRemove);
      setCheckParams(newArray);
      enqueueSnackbar('Check Item deleted successfully!');
    } catch (err) {
      enqueueSnackbar('Check Item delete failed!', { variant: `error` });
      console.error(err.message);
    }
  };
  
  useEffect(()=>{
    if(ListTitle?.length > 200){
      setItemListTitleError('Item List Title must be at most 200 characters')
    }else if(checkItemList?.length > 0 && ListTitle.trim() === ''){
      setItemListTitleError('Item List Title must required!')
    }else{
      setItemListTitleError('')
    }

    // if(checkItemList?.length > 0 && ListTitle.trim() !== ''){
    //   setCheckItemListButtonVariant('outlined');
    //   setCheckItemListButtoncolor('error');
    // }else{
    //   setCheckItemListButtonVariant('contained');
    //   setCheckItemListButtoncolor('primary');
    // }

    if(checkItemList && checkItemList?.length > 100){
      setItemListError('Check Items must be at most 99!')
    }else{
      setItemListError('')
    }
  },[checkItemList, ListTitle ])

  const saveCheckParam = (prevCheckParamNumber) =>{
          if(typeof ListTitle !== 'string' || ListTitle && ListTitle?.length === 0 ){
            setItemListTitleError('Item List Title is Required!')
          }

          if(checkItemList && checkItemList?.length === 0){
            setItemListError('Please select Check Item!')
          }

          if( !checkItemListError.trim() && !checkItemListTitleError.trim() ){
      try {
        const updatedCheckParam = [...checkParams]; 
        const checkItemObject= { ListTitle, checkItems: checkItemList }
        if(prevCheckParamNumber > checkParams.length-1) {
          updatedCheckParam.splice(prevCheckParamNumber, 0, checkItemObject);
          setCheckParams(updatedCheckParam);
          setCheckParamNumber(() => prevCheckParamNumber + 1) 
        enqueueSnackbar('Saved success!');
        }else if(prevCheckParamNumber < checkParams.length-1){
          updatedCheckParam[prevCheckParamNumber]= checkItemObject;
          setCheckParams(updatedCheckParam);
          setCheckParamNumber(checkParams.length) 
          enqueueSnackbar('Updated success!');
        }
        else if(prevCheckParamNumber === checkParams.length-1){
          updatedCheckParam[prevCheckParamNumber]= checkItemObject;
          setCheckParams(updatedCheckParam);
          setCheckParamNumber(checkParams.length) 
          enqueueSnackbar('Updated success!');
        }
        setValue('ListTitle','')
        setValue('checkItemCategory',null)
        setCheckItemList([])
      } catch (err) {
        enqueueSnackbar('Save failed!', { variant: `error` });
        console.error(err.message);
      }
    }
  }

  return (
                  <Stack spacing={2}>
                    <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary' }}>
                      Check Items
                    </Typography>
                    <RHFTextField name="ListTitle" label="Item List Title*" Error={!!checkItemListTitleError} helperText={checkItemListTitleError} />

                      <RHFAutocomplete 
                          name="checkItemCategory"
                          label="Service Category"
                          options={activeServiceCategories}
                          isOptionEqualToValue={(option, value) => option._id === value._id}
                          getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                          renderOption={(props, option) => (
                            <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                          )}
                      />

                      <RHFAutocomplete
                        multiple
                        name="paramList"
                        label="Select Items"
                        value={checkItemList}
                        disableCloseOnSelect
                        disableClearable
                        filterSelectedOptions
                        options={activeCheckItems.filter(activeCheckItem => checkItemCategory ? activeCheckItem?.category?._id === checkItemCategory?._id : activeCheckItem)}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        getOptionLabel={(option) => `${option.name ? option.name : ''} ${option?.category?.name ? '-' : ''} ${option?.category?.name ? option?.category?.name : ''} ${option?.inputType ? '-' : '' } ${option?.inputType ? option?.inputType : '' }`}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>{`${option.name ? option.name : ''} ${option?.category?.name ? '-' : ''} ${option?.category?.name ? option?.category?.name : ''} ${option?.inputType ? '-' : '' } ${option?.inputType ? option?.inputType : '' }`}</li>
                        )}
                        onChange={(event, newValue) => {
                          if(newValue){
                            handleInputChange(newValue)
                          }
                        }}
                        renderTags={(value, getTagProps) => ''}
                        Error={!!checkItemListError} helperText={checkItemListError}
                      /> 

                      <Grid item md={12} >
                      <Grid sx={{ minWidth: 250, width: '100%', minHeight:75 , my:3, borderRadius:'10px' }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell size='small' align='left'>Checked Items</TableCell>
                              <TableCell size='small' align='right'>{`  `}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {checkItemList?.length > 0 && (checkItemList?.map((row, index) => (
                              <TableRow
                                key={uuidv4()}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, index)}
                                hover
                              >
                                <TableCell size='small' align='left' ><b>{`${index+1}). `}</b>{`${row.name}  ${row?.category?.name ? '-' : ''} ${row?.category?.name ? row?.category?.name : ''} ${row?.inputType ? '-' : '' } ${row?.inputType ? row?.inputType : '' }`}</TableCell>
                                <TableCell size='small' align='right'>
                                <ViewFormEditDeleteButtons onDelete={() => handleRowDelete(index)} sm/>
                                </TableCell>
                              </TableRow>
                            ))) }
                          </TableBody>
                        </Table>
                            {checkItemList?.paramList?.length === 0 && (
                              <Grid item md={12} display='flex' justifyContent='center' >
                                <Typography variant="subtitle2" sx={{ mt:0.7}}>No Checked Items selected</Typography>
                              </Grid>
                              )}
                      </Grid>
                      <Grid item md={12} display="flex" justifyContent="flex-end" >
                        <Button
                          disabled={(!checkItemList?.length ?? 0) || ( ListTitle?.trim() === '') }
                          onClick={()=>saveCheckParam(checkParamNumber)}
                          fullWidth={ isMobile }
                          variant="contained" 
                          color='primary' 
                          sx={{ ...(isMobile && { width: '100%', })}}
                        >Save List</Button>
                      </Grid>

                    </Grid>
                    {checkParams && checkParams?.length > 0 && <Stack sx={{ minWidth: 250,  minHeight:75 }}>
                    <TableContainer >
                      <Table>
                        <TableBody>
                          {checkParams && checkParams.map((value, checkParamsIndex) =>( typeof value?.checkItems?.length === 'number' &&
                          <CollapsibleCheckedItemRow key={uuidv4()} value={value} index={checkParamsIndex} toggleEdit={toggleEdit} deleteIndex={deleteIndex} handleListDragStart={handleListDragStart} handleListDrop={handleListDrop} />
                          ))}
                      </TableBody>
                      </Table>
                      </TableContainer>
                      </Stack>}
                </Stack>
  )
}

export default memo(CheckItemTable)

CheckItemTable.propTypes = {
    checkParams: PropTypes.array.isRequired,
    setCheckParams: PropTypes.func.isRequired,
    checkItemList: PropTypes.array, 
    setCheckItemList: PropTypes.func,
    ListTitle: PropTypes.string,
    setValue: PropTypes.func.isRequired,
    checkItemCategory: PropTypes.object,
};