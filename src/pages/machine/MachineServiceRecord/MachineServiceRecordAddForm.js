import { useEffect, useMemo, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack, Typography, TextField,  Autocomplete, Checkbox, InputAdornment, Skeleton } from '@mui/material';

import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import ViewFormField from '../../components/ViewForms/ViewFormField';
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
// ----------------------------------------------------------------------

function MachineServiceRecordAddForm() {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { machine } = useSelector((state) => state.machine)
  const { activeSecurityUsers, securityUser } = useSelector((state) => state.user);
  const { activeContacts } = useSelector((state) => state.contact);
  const { activeServiceRecordConfigsForRecords, serviceRecordConfig, recordTypes, isLoadingCheckItems } = useSelector((state) => state.serviceRecordConfig);
  const [ activeServiceRecordConfigs, setActiveServiceRecordConfigs ] = useState([]);
  const [checkParamList, setCheckParamList] = useState([]);
  console.log("checkParamList : ",checkParamList)
  const [docType, setDocType] = useState(null);
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
      docRecordType: null,
      serviceRecordConfiguration: null,
      serviceDate: new Date(),
      technician:   securityUser?.contact || null,
      decoilers: machineDecoilers,
      serviceNote: '',
      maintenanceRecommendation: '',
      suggestedSpares: '',
      files: [],
      // checkParamFiles: [],
      operators: [],
      operatorRemarks: '',
      isActive: true,
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
    control,
  } = methods;

  const { decoilers, operators, serviceRecordConfiguration, technician, docRecordType } = watch()
  
  useEffect(() => {
      if(docRecordType === null){
        setActiveServiceRecordConfigs(activeServiceRecordConfigsForRecords)
      }else{
        if(docRecordType.name !== serviceRecordConfiguration?.recordType ){
          dispatch(resetServiceRecordConfig())
          setValue('serviceRecordConfiguration',null)
        }
        setActiveServiceRecordConfigs(activeServiceRecordConfigsForRecords.filter(activeRecordConfig => activeRecordConfig.recordType === docRecordType.name ))
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[docRecordType, activeServiceRecordConfigsForRecords ])

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
    setCheckParamList(serviceRecordConfig?.checkParams)
  },[serviceRecordConfig])

  const handleTypeChange = (event, newValue) => {
    if(newValue?._id===3) setDocType(true)
    else setDocType(false)
    const recordType = {recordType:newValue?.name}
    setValue('serviceRecordConfiguration',null);
    dispatch(getActiveServiceRecordConfigsForRecords(machine?._id, recordType))
  }

  const handleParamChange = (event, newValue) => {
    if(newValue != null){
    setValue('serviceRecordConfiguration',newValue)
    trigger('serviceRecordConfiguration');
    if(newValue?.recordType==='Training'){
      setDocType(true)
    }else{
      setDocType(false)
    }
    }else{
      dispatch(resetServiceRecordConfig())
      setValue('serviceRecordConfiguration',null)
    }
  }
  

  const onSubmit = async (data) => {
    try {
      const checkParams_ = [];

      if(checkParamList && 
        Array.isArray(checkParamList) && 
        checkParamList.length>0) 
        checkParamList.forEach((checkParam_, index )=>{
          if(Array.isArray(checkParam_.paramList) && 
            checkParam_.paramList.length>0) {
            checkParam_.paramList.forEach((CI,ind)=>{
              console.log("CI : ",CI)
              checkParams_.push({
                serviceParam:CI._id,
                name:CI.name,
                paramListTitle:checkParam_.paramListTitle,
                value:CI?.value,
                date:CI?.date || '',
                comments:CI?.comments,
                status:CI?.status?.name
              });
            });
          }
        });
        console.log("checkParams_ : ",checkParams_)
      data.checkParams = checkParams_;
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

  const handleChangeCheckItemListValue = (index, childIndex, value) => {
      const updatedCheckParams = [...checkParamList];
      const updatedParamObject = { 
        ...updatedCheckParams[index],
        paramList: [...updatedCheckParams[index].paramList],
      };
      updatedParamObject.paramList[childIndex] = {
        ...updatedParamObject.paramList[childIndex],
        value,
      };
      updatedCheckParams[index] = updatedParamObject;
  setCheckParamList(updatedCheckParams);
  }

  const handleChangeCheckItemListDate = (index, childIndex, date) => {
    console.log("date : " , date)
    const updatedCheckParams = [...checkParamList];
    const updatedParamObject = { 
      ...updatedCheckParams[index],
      paramList: [...updatedCheckParams[index].paramList],
    };
    updatedParamObject.paramList[childIndex] = {
      ...updatedParamObject.paramList[childIndex],
      date,
    };
    updatedCheckParams[index] = updatedParamObject;
  setCheckParamList(updatedCheckParams);
  }
  
  const handleChangeCheckItemListCheckBoxValue = (index, childIndex) => {
      const updatedCheckParams = [...checkParamList];
        const updatedParamObject = { 
          ...updatedCheckParams[index],
          paramList: [ ...updatedCheckParams[index].paramList],
        };
        updatedParamObject.paramList[childIndex] = {
          ...updatedParamObject.paramList[childIndex],
          value: !updatedParamObject.paramList[childIndex].value,
        };
        updatedCheckParams[index] = updatedParamObject;
      setCheckParamList(updatedCheckParams);
  }

  const handleChangeCheckItemListStatus = (index, childIndex, status) => {
    const updatedCheckParams = [...checkParamList];
    const updatedParamObject = { 
      ...updatedCheckParams[index],
      paramList: [ ...updatedCheckParams[index].paramList ],
    };
    updatedParamObject.paramList[childIndex] = {
      ...updatedParamObject.paramList[childIndex],
      status
    };
    updatedCheckParams[index] = updatedParamObject;
  setCheckParamList(updatedCheckParams);
  }

  const handleChangeCheckItemListComment = (index, childIndex, comments) => {
    const updatedCheckParams = [...checkParamList];
    const updatedParamObject = { 
      ...updatedCheckParams[index],
      paramList: [...updatedCheckParams[index].paramList ],
    };
    updatedParamObject.paramList[childIndex] = {
      ...updatedParamObject.paramList[childIndex],
      comments
    };
    updatedCheckParams[index] = updatedParamObject;
  setCheckParamList(updatedCheckParams);
  }
  
  return (
      <FormProvider methods={methods}  onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <FormHeading heading="New Service Record" />
                <Grid container>
                  <ViewFormField sm={6} heading='Customer' param={machine?.customer?.name} label="serialNo"/>
                  <ViewFormField sm={6} heading='Machine' param={`${machine.serialNo} ${machine.name ? '-' : ''} ${machine.name ? machine.name : ''}`} label="serialNo"/>
                  <ViewFormField sm={6} heading='Machine Model Category' param={machine?.machineModel?.category?.name} label="serialNo"/>
                  <ViewFormField sm={6} heading='Machine Model' param={machine?.machineModel?.name} label="serialNo"/>
                  <ViewFormField sm={6} heading='Decoilers' arrayParam={defaultValues.decoilers} chipLabel="serialNo"/>
                </Grid>
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
                    getOptionLabel={(option) => `${option?.docTitle ?? ''} ${option?.docTitle ? '-' : '' } ${option.recordType ? option.recordType :   ''}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option) => (
                    <li {...props} key={option._id}>{`${option?.docTitle ?? ''} ${option?.docTitle ? '-' : '' } ${option.recordType ? option.recordType : ''}`}</li>
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

                  <RHFDatePicker name="serviceDate" label="Service Date" />
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
                    <RHFTextField name="technicianRemarks" label="Technician Remarks" minRows={3} multiline/> 
                    {checkParamList?.length > 0 && <FormHeading heading={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS} />}

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
                    {checkParamList?.map((row, index) =>
                          ( typeof row?.paramList?.length === 'number' &&
                          <>
                            <CollapsibleCheckedItemInputRow 
                              key={index}
                              row={row} 
                              index={index} 
                              checkParamList={checkParamList} 
                              handleChangeCheckItemListDate={handleChangeCheckItemListDate}
                              handleChangeCheckItemListValue={handleChangeCheckItemListValue}
                              handleChangeCheckItemListStatus={handleChangeCheckItemListStatus}
                              handleChangeCheckItemListCheckBoxValue={handleChangeCheckItemListCheckBoxValue}
                              handleChangeCheckItemListComment={handleChangeCheckItemListComment}
                            />
                        </>
                          ))}
                      </>
                    }

                    { serviceRecordConfig?.enableNote && <RHFTextField name="serviceNote" label="Note" minRows={3} multiline/> }
                    { serviceRecordConfig?.enableMaintenanceRecommendations && <RHFTextField name="maintenanceRecommendation" label="Maintenance Recommendation" minRows={3} multiline/> }
                    { serviceRecordConfig?.enableSuggestedSpares && <RHFTextField name="suggestedSpares" label="Suggested Spares" minRows={3} multiline/> }
                    {docType &&
                      <Autocomplete multiple
                        name="operators" 
                        defaultValue={defaultValues.operators}
                        id="operator-autocomplete" options={activeContacts}
                        onChange={(event, newValue) => setValue('operators',newValue)}
                        getOptionLabel={(option) => `${option.firstName ? option.firstName :   ''} ${option.lastName ? option.lastName :   ''}`}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" label="Operators" placeholder="Select Operators"/>
                        )}
                      />
                    }
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