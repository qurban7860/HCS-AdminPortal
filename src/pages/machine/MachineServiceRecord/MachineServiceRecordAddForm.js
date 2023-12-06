import { useEffect, useMemo, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack, Typography, TextField,  Autocomplete,   Skeleton } from '@mui/material';

import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import FormHeading from '../../components/DocumentForms/FormHeading';
import { FORMLABELS } from '../../../constants/default-constants';
// slice
import { addMachineServiceRecord, setMachineServiceRecordAddFormVisibility } from '../../../redux/slices/products/machineServiceRecord';
import { getActiveServiceRecordConfigsForRecords, getServiceRecordConfig, resetServiceRecordConfig } from '../../../redux/slices/products/serviceRecordConfig';
import { getActiveContacts, resetActiveContacts } from '../../../redux/slices/customer/contact';
// components
import { useSnackbar } from '../../../components/snackbar';
import { MachineServiceRecordSchema } from '../../schemas/machine';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch,
  RHFDatePicker
} from '../../../components/hook-form';
import { getActiveSecurityUsers, getSecurityUser } from '../../../redux/slices/securityUser/securityUser';
import CollapsibleCheckedItemInputRow from './CollapsibleCheckedItemInputRow';
import FormLabel from '../../components/DocumentForms/FormLabel';

// ----------------------------------------------------------------------

function MachineServiceRecordAddForm() {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { machine } = useSelector((state) => state.machine)
  const { activeSecurityUsers, securityUser } = useSelector((state) => state.user);
  const { activeContacts } = useSelector((state) => state.contact);
  const { activeServiceRecordConfigsForRecords, serviceRecordConfig, recordTypes, isLoadingCheckItems } = useSelector((state) => state.serviceRecordConfig);
  const [ activeServiceRecordConfigs, setActiveServiceRecordConfigs ] = useState([]);
  const [checkItemLists, setCheckItemLists] = useState([]);
  const user = { _id: localStorage.getItem('userId'), name: localStorage.getItem('name') };

  useEffect( ()=>{
    dispatch(getActiveServiceRecordConfigsForRecords(machine?._id))
    dispatch(resetActiveContacts())
    if(machine?.customer?._id){
      dispatch(getActiveContacts(machine?.customer?._id))
    }
    dispatch(getActiveSecurityUsers({roleType:'Support'}))
    dispatch(getSecurityUser(user._id))
    dispatch(resetServiceRecordConfig())
  },[dispatch, machine, user?._id])





  const machineDecoilers = (machine?.machineConnections || []).map((decoiler) => ({
    _id: decoiler?.connectedMachine?._id ?? null,
    name: decoiler?.connectedMachine?.name ?? null,
    serialNo: decoiler?.connectedMachine?.serialNo ?? null
  }));
  const defaultValues = useMemo(
    () => {
      const initialValues = {
      docRecordType:                null,
      serviceRecordConfiguration:   null,
      serviceDate:                  new Date(),
      versionNo:                    1,
      customer:                     machine?.customer?._id || null,
      site:                         machine?.instalationSite?._id,
      // machine:                      machine?._id || null,
      decoilers:                    machineDecoilers || [],
      technician:                   securityUser?.contact || null,
      technicianNotes:              '',
      textBeforeCheckItems:         '',
      textAfterCheckItems:          '',
      serviceNote:                  '',
      recommendationNote:           '',
      internalComments:             '',
      suggestedSpares:              '',
      internalNote:                 '',
      operators:                    [],
      files:                        [],
      operatorNotes:                '',
      checkItemRecordValues:        [],
      isActive:                     true,
    }
    return initialValues;
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(MachineServiceRecordSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { decoilers, operators, serviceRecordConfiguration, docRecordType } = watch()
  
  // useEffect(() => {

  //     setActiveServiceRecordConfigs([]);

  //     if(docRecordType !== null){
  //       dispatch(getActiveServiceRecordConfigsForRecords(machine?._id, docRecordType))  
  //       setActiveServiceRecordConfigs(activeServiceRecordConfigsForRecords)
  //     }

  //     setValue('serviceRecordConfiguration',null)

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   },[docRecordType])

    useEffect(() => {
      if(docRecordType?.name){
        if(docRecordType?.name !== serviceRecordConfiguration?.recordType ){
          dispatch(resetServiceRecordConfig())
        }
        setActiveServiceRecordConfigs(activeServiceRecordConfigsForRecords.filter(activeRecordConfig => activeRecordConfig?.recordType?.toLowerCase() === docRecordType?.name?.toLowerCase() ))
      }else{
        setActiveServiceRecordConfigs([])
      }
      setValue('serviceRecordConfiguration',null)
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[docRecordType, activeServiceRecordConfigsForRecords])
    

    useEffect(() =>{
      if(serviceRecordConfiguration !== null){
      dispatch(getServiceRecordConfig(serviceRecordConfiguration?._id))
    }
    },[dispatch, serviceRecordConfiguration])

  useEffect(()=>{
    if(securityUser?.customer?.name === 'Howick' && !!securityUser?.roles?.find((role) => role?.roleType === 'Support')){
      setValue('technician',user)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[securityUser, setValue, user?._id])

  useEffect(()=>{
    setCheckItemLists(serviceRecordConfig?.checkItemLists)
  },[serviceRecordConfig])

  const handleParamChange = (event, newValue) => {
    if(newValue != null){
    setValue('serviceRecordConfiguration',newValue)
    trigger('serviceRecordConfiguration');
    
    }else{
      dispatch(resetServiceRecordConfig())
      setValue('serviceRecordConfiguration',null)
    }
  }
  

  const onSubmit = async (data) => {
    try {
      const checkItemLists_ = [];
console.log("checkItemLists : ",checkItemLists)
      if(checkItemLists && 
        Array.isArray(checkItemLists) && 
        checkItemLists.length>0) 
        checkItemLists.forEach((checkParam_, index )=>{
          if(Array.isArray(checkParam_.checkItems) && 
            checkParam_.checkItems.length>0) {
            checkParam_.checkItems.forEach((CI,ind)=>(
              CI?.checked && checkItemLists_.push({
                machineCheckItem: CI?._id,
                checkItemListId:  checkParam_?._id,
                checkItemValue:   CI?.inputType?.toLowerCase() === 'boolean' ? CI?.checkItemValue || false : CI?.inputType?.toLowerCase() === 'status' && CI?.checkItemValue?.name || CI?.inputType?.toLowerCase() !== 'status' &&CI?.checkItemValue || '',
                comments:CI?.comments,
              })
            ));
          }
        });
      data.checkItemRecordValues = checkItemLists_;
      data.decoilers = decoilers;
      data.operators = operators;
      await dispatch(addMachineServiceRecord(machine?._id,data));
      reset();
      dispatch(setMachineServiceRecordAddFormVisibility(false))
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };
  
  const toggleCancel = () => { dispatch(setMachineServiceRecordAddFormVisibility(false)) };

  const handleChangeCheckItemListValue = (index, childIndex, checkItemValue) => {
      const updatedCheckParams = [...checkItemLists];
      const updatedParamObject = { 
        ...updatedCheckParams[index],
        checkItems: [...updatedCheckParams[index].checkItems],
      };
      updatedParamObject.checkItems[childIndex] = {
        ...updatedParamObject.checkItems[childIndex],
        checkItemValue,
      };
      updatedCheckParams[index] = updatedParamObject;
  setCheckItemLists(updatedCheckParams);
  }

  const handleChangeCheckItemListDate = (index, childIndex, date) => {
    const updatedCheckParams = [...checkItemLists];
    const updatedParamObject = { 
      ...updatedCheckParams[index],
      checkItems: [...updatedCheckParams[index].checkItems],
    };
    updatedParamObject.checkItems[childIndex] = {
      ...updatedParamObject.checkItems[childIndex],
      checkItemValue: date,
    };
    updatedCheckParams[index] = updatedParamObject;
  setCheckItemLists(updatedCheckParams);
  }
  
  const handleChangeCheckItemListCheckBoxValue = (index, childIndex) => {
      const updatedCheckParams = [...checkItemLists];
        const updatedParamObject = { 
          ...updatedCheckParams[index],
          checkItems: [ ...updatedCheckParams[index].checkItems],
        };
        updatedParamObject.checkItems[childIndex] = {
          ...updatedParamObject.checkItems[childIndex],
          checkItemValue: !updatedParamObject.checkItems[childIndex].checkItemValue,
        };
        updatedCheckParams[index] = updatedParamObject;
      setCheckItemLists(updatedCheckParams);
  }

  const handleChangeCheckItemListChecked = ( index, childIndex ) =>{
    const updatedCheckParams = [...checkItemLists];
    const updatedParamObject = { 
      ...updatedCheckParams[index],
      checkItems: [ ...updatedCheckParams[index].checkItems],
    };
    updatedParamObject.checkItems[childIndex] = {
      ...updatedParamObject.checkItems[childIndex],
      checked: !updatedParamObject.checkItems[childIndex].checked,
    };
    updatedCheckParams[index] = updatedParamObject;
  setCheckItemLists(updatedCheckParams);
  }

  const handleChangeCheckItemListStatus = (index, childIndex, status) => {
    const updatedCheckParams = [...checkItemLists];
    const updatedParamObject = { 
      ...updatedCheckParams[index],
      checkItems: [ ...updatedCheckParams[index].checkItems ],
    };
    updatedParamObject.checkItems[childIndex] = {
      ...updatedParamObject.checkItems[childIndex],
      checkItemValue: status 
    };
    updatedCheckParams[index] = updatedParamObject;
  setCheckItemLists(updatedCheckParams);
  }

  const handleChangeCheckItemListComment = (index, childIndex, comments) => {
    const updatedCheckParams = [...checkItemLists];
    const updatedParamObject = { 
      ...updatedCheckParams[index],
      checkItems: [...updatedCheckParams[index].checkItems ],
    };
    updatedParamObject.checkItems[childIndex] = {
      ...updatedParamObject.checkItems[childIndex],
      comments
    };
    updatedCheckParams[index] = updatedParamObject;
  setCheckItemLists(updatedCheckParams);
  }
  
  return (
      <FormProvider methods={methods}  onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <FormHeading heading="New Service Record" />
                {/* <Grid container>
                  <ViewFormField sm={6} heading='Machine' param={`${machine.serialNo} ${machine.name ? '-' : ''} ${machine.name ? machine.name : ''}`} />
                  <ViewFormField sm={6} heading='Machine Model Category' param={machine?.machineModel?.category?.name} />
                  <ViewFormField sm={6} heading='Machine Model' param={machine?.machineModel?.name} />
                  <ViewFormField sm={6} heading='Decoilers' arrayParam={defaultValues.decoilers} chipLabel="serialNo"/>
                </Grid> */}
                <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >
                  
                    {/* <RHFTextField name="customer" label="Customer" value={`${machine?.customer?.name ? machine?.customer?.name : ''}`} disabled/>
                    <RHFTextField name="machine" label="Machine" value={`${machine.serialNo} ${machine.name ? '-' : ''} ${machine.name ? machine.name : ''}`} disabled/>
                    <RHFTextField name="machine" label="Machine Model Category" value={machine?.machineModel?.category?.name || ''} disabled/>
                    <RHFTextField name="machine" label="Machine Model" value={machine?.machineModel?.name || ''} disabled/> */}
                  
                  <RHFAutocomplete 
                    name="docRecordType"
                    label="Document Type*"
                    options={recordTypes}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />

                  <RHFAutocomplete
                    name="serviceRecordConfiguration"
                    label="Service Record Configuration"
                    options={activeServiceRecordConfigs}
                    getOptionLabel={(option) => `${option?.docTitle || ''} ${option?.docTitle ? '-' : '' } ${option.recordType || ''} ${option?.docVersionNo ? '- v' : '' }${option?.docVersionNo || ''}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option) => (
                    <li {...props} key={option._id}>{`${option?.docTitle || ''} ${option?.docTitle ? '-' : '' } ${option.recordType || ''} ${option?.docVersionNo ? '- v' : '' }${option?.docVersionNo || ''}`}</li>
                    )}
                    onChange={handleParamChange}
                  />
                </Box>       
                <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >

                  <RHFDatePicker inputFormat='dd/MM/yyyy' name="serviceDate" label="Service Date" />
                  <RHFTextField name="versionNo" label="Version No" disabled/>

                  {/* <Autocomplete multiple
                    readOnly
                    name="decoilers" 
                    defaultValue={defaultValues.decoilers}
                    id="operator-autocomplete" options={machineDecoilers}
                    onChange={(event, newValue) => setValue('decoilers',newValue)}
                    getOptionLabel={(option) => `${option?.name||""} ${option?.serialNo||""}`}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" label="Decoilers"  />
                    )}
                  /> */}
                  
                  </Box>
                    
                    <RHFAutocomplete
                    name="technician"
                    label="Technician"
                    options={activeSecurityUsers}
                    getOptionLabel={(option) => option?.name || ''}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option) => (
                    <li {...props} key={option._id}>{option.name || ''}</li>
                    )}
                  />
                    <RHFTextField name="technicianNotes" label="Technician Notes" minRows={3} multiline/> 
                    <RHFTextField name="textBeforeCheckItems" label="Text Before Check Items" minRows={3} multiline/> 
                    
                    {checkItemLists?.length > 0 && <FormLabel content={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS} />}

                    {isLoadingCheckItems ? 
                    <Box sx={{ width: '100%',mt:1 }}>
                      <Skeleton />
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                      <Skeleton animation="wave" />
                      <Skeleton animation={false} />
                    </Box>
                    :<>
                    {checkItemLists?.map((row, index) =>
                          ( typeof row?.checkItems?.length === 'number' &&
                            <CollapsibleCheckedItemInputRow 
                              key={index}
                              row={row} 
                              index={index} 
                              checkItemLists={checkItemLists} 
                              handleChangeCheckItemListDate={handleChangeCheckItemListDate}
                              handleChangeCheckItemListValue={handleChangeCheckItemListValue}
                              handleChangeCheckItemListStatus={handleChangeCheckItemListStatus}
                              handleChangeCheckItemListChecked={handleChangeCheckItemListChecked}
                              handleChangeCheckItemListCheckBoxValue={handleChangeCheckItemListCheckBoxValue}
                              handleChangeCheckItemListComment={handleChangeCheckItemListComment}
                            />
                          ))}
                      </>
                    }

                    <RHFTextField name="textAfterCheckItems" label="Text After Check Items" minRows={3} multiline/> 
                    
                    
                    {/* <RHFTextField name="internalComments" label="Internal Comments" minRows={3} multiline/> */}
                    { serviceRecordConfig?.enableNote && <RHFTextField name="serviceNote" label="Service Note" minRows={3} multiline/> }
                    { serviceRecordConfig?.enableMaintenanceRecommendations && <RHFTextField name="recommendationNote" label="Recommendation Note" minRows={3} multiline/> }
                    { serviceRecordConfig?.enableSuggestedSpares && <RHFTextField name="suggestedSpares" label="Suggested Spares" minRows={3} multiline/> }
                    <RHFTextField name="internalNote" label="Internal Note" minRows={3} multiline/> 

                    {/* {docType && */}
                      <Autocomplete multiple
                        name="operators" 
                        defaultValue={defaultValues.operators}
                        id="operator-autocomplete" options={activeContacts}
                        onChange={(event, newValue) => setValue('operators',newValue)}
                        getOptionLabel={(option) => `${option?.firstName ||  ''} ${option.lastName || ''}`}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" label="Operators" placeholder="Select Operators"/>
                        )}
                      />
                    {/* } */}

                    <RHFTextField name="operatorNotes" label="Operator Notes" minRows={3} multiline/> 

                  <Grid container display="flex">
                    <RHFSwitch
                      name="isActive"
                      labelPlacement="start"
                      label={
                        <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                          Active
                        </Typography>
                      }
                    />
                  </Grid>
                  <AddFormButtons isDisabled={docRecordType === null} isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
  );
}

export default memo(MachineServiceRecordAddForm)