import { memo, useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Card, Grid, Stack, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { getActiveMachineServiceParams } from '../../../redux/slices/products/machineServiceParams';
import { RHFTextField, RHFAutocomplete} from '../../../components/hook-form';
import useResponsive from '../../../hooks/useResponsive';
import { useSnackbar } from '../../../components/snackbar';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import CollapsibleCheckedItemRow from './CollapsibleCheckedItemRow'

const CheckItemTable = ({ checkParams, setCheckParams, paramListTitle, setValue }) => {

    const isMobile = useResponsive('down', 'sm');
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { serviceRecordConfig } = useSelector((state) => state.serviceRecordConfig);
    const { activeMachineServiceParams } = useSelector((state) => state.machineServiceParam);
    const [checkParamNumber, setCheckParamNumber]= useState(serviceRecordConfig?.checkParams?.length || 0);
    const [checkItemList, setCheckItemList] = useState([]);
    const [checkItemListTitleError, setItemListTitleError] = useState('');
    const [checkItemListError, setItemListError] = useState('');
console.log("checkItemList : ", checkItemList)
    // useEffect(() => {
    //   setCheckParamNumber()
    // },[checkParams])

    useEffect(() => {
        dispatch(getActiveMachineServiceParams());
      }, [dispatch]);

      const handleInputChange = (value) => {
        if (value) {
          setCheckItemList((checkItems) => [...checkItems, value[0]]);
        }
      };


  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };


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
      enqueueSnackbar('Deleted success!');
    } catch (err) {
      enqueueSnackbar('Delete failed!', { variant: 'error' });
      console.error(err.message);
    }
  };

  const toggleEdit = (index) => {setCheckItemList(checkParams[index]?.paramList); setCheckParamNumber(index); setValue('paramListTitle',checkParams[index]?.paramListTitle) };

  const deleteIndex = (indexToRemove) => {
    try {
      const newArray =  checkParams.filter((_, index) => index !== indexToRemove);
      setCheckParams(newArray);
      enqueueSnackbar('Deleted success!');
    } catch (err) {
      enqueueSnackbar('Delete failed!', { variant: `error` });
      console.error(err.message);
    }
  };
useEffect(()=>{
  if(paramListTitle?.length > 200){
    setItemListTitleError('Item List Title is too long')
  }else{
    setItemListTitleError('')
  }

  if(checkItemList && checkItemList?.length > 100){
    setItemListError('Check Item limit exceeded!')
  }else{
    setItemListError('')
  }
},[checkItemList, paramListTitle ])

  const saveCheckParam = (prevCheckParamNumber) =>{
          if(typeof paramListTitle !== 'string' || paramListTitle && paramListTitle?.length === 0 ){
            setItemListTitleError('Item List Title is Required!')
          }

          if(checkItemList && checkItemList?.length === 0){
            setItemListError('Please select Check Item!')
          }

          if( !checkItemListError.trim() && !checkItemListTitleError.trim() ){
      try {
        const updatedCheckParam = [...checkParams]; 
        const checkItemObject= { paramListTitle, paramList: checkItemList }
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
        setValue('paramListTitle','')
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
                    <RHFTextField name="paramListTitle" label="Item List Title*" Error={!!checkItemListTitleError} helperText={checkItemListTitleError} />

                      <RHFAutocomplete
                        multiple
                        name="paramList"
                        label="Select Items"
                        value={[]}
                        options={activeMachineServiceParams}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        getOptionLabel={(option) => `${option.name ? option.name : ''} ${option?.category?.name ? '-' : ''} ${option?.category?.name ? option?.category?.name : ''} ${option?.inputType ? '-' : '' } ${option?.inputType ? option?.inputType : '' }`}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>{`${option.name ? option.name : ''} ${option?.category?.name ? '-' : ''} ${option?.category?.name ? option?.category?.name : ''} ${option?.inputType ? '-' : '' } ${option?.inputType ? option?.inputType : '' }`}</li>
                        )}
                        // filterSelectedOptions
                        onChange={(event, newValue) => {
                          if(newValue){
                            handleInputChange(newValue)
                          }
                          // const updatedEvent = { target: { name: "paramList", value: newValue }};
                          // handleInputChange(updatedEvent, checkParamNumber);
                          // event.preventDefault();
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
                              >
                                <TableCell size='small' align='left' ><b>{`${index+1}). `}</b>{`${row.name}`}</TableCell>
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
                          disabled={(!checkItemList?.length ?? 0) || (!paramListTitle ?? '') }
                          onClick={()=>saveCheckParam(checkParamNumber)}
                          fullWidth={ isMobile }
                          variant="contained" color='primary' sx={{ ...(isMobile && { width: '100%' })}}
                        >Save List</Button>
                      </Grid>
                    </Grid>
                    {checkParams.length > 0 && <Stack sx={{ minWidth: 250,  minHeight:75 }}>
                    <TableContainer >
                      <Table>
                        <TableBody>
                          {checkParams.map((value, checkParamsIndex) =>( typeof value?.paramList?.length === 'number' &&
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
    paramListTitle: PropTypes.string,
    setValue: PropTypes.func.isRequired,
};