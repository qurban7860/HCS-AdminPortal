import { useEffect, useMemo, useCallback, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { v4 as uuidv4 } from 'uuid';
import { Box, Card, Grid, Stack, Typography, TextField,  Autocomplete, Checkbox } from '@mui/material';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import FormHeading from '../../components/DocumentForms/FormHeading';
import { FORMLABELS } from '../../../constants/default-constants';
// slice
import { addMachineServiceRecord, setMachineServiceRecordAddFormVisibility } from '../../../redux/slices/products/machineServiceRecord';
import { getMachineConnections } from '../../../redux/slices/products/machineConnections';
import { getActiveServiceRecordConfigsForRecords } from '../../../redux/slices/products/serviceRecordConfig';
import { getActiveContacts } from '../../../redux/slices/customer/contact';
// components
import { useSnackbar } from '../../../components/snackbar';
import { MachineServiceRecordSchema } from '../../schemas/machine';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch,
  RHFUpload,
  RHFDatePicker,
  RHFCheckbox
} from '../../../components/hook-form';
// import CollapsibleCheckedItemInputRow from './CollapsibleCheckedItemInputRow'

// ----------------------------------------------------------------------

function MachineServiceRecordAddForm() {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { machine } = useSelector((state) => state.machine)
  const { securityUser } = useSelector((state) => state.user);
  const { activeContacts } = useSelector((state) => state.contact);
  const { activeServiceRecordConfigsForRecords } = useSelector((state) => state.serviceRecordConfig);
  const { machineConnections } = useSelector((state) => state.machineConnections);
  // const [checkParam, setCheckParam] = useState([]);
  const [checkParamList, setCheckParamList] = useState([]);
console.log("checkParamList : ",checkParamList)

  const _id = localStorage.getItem('userId');
  useEffect( ()=>{
    dispatch(getMachineConnections(machine?.customer?._id))
    dispatch(getActiveServiceRecordConfigsForRecords(machine?._id))
    dispatch(getActiveContacts(machine?.customer?._id))
  },[dispatch, machine])

  const defaultValues = useMemo(
    () => {
      const initialValues = {
      serviceRecordConfig: null,
      serviceDate: new Date(),
      technician:   securityUser?.contact || null,
      decoiler: [],
      serviceNote: '',
      maintenanceRecommendation: '',
      suggestedSpares: '',
      files: [],
      // checkParamFiles: [],
      operator: null,
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
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = methods;

  const {  files, decoiler, serviceRecordConfig } = watch()

  useEffect(()=>{
    setCheckParamList(serviceRecordConfig?.checkParams)
  },[serviceRecordConfig])

  const onSubmit = async (data) => {
    try {
      const checkParams_ = [];

      if(serviceRecordConfig && 
        Array.isArray(serviceRecordConfig.checkParams) && 
        serviceRecordConfig.checkParams.length>0) 
        serviceRecordConfig.checkParams.forEach((checkParam_, index )=>{
          if(Array.isArray(checkParam_.paramList) && 
            checkParam_.paramList.length>0) {
            checkParam_.paramList.forEach((CI,ind)=>{
              checkParams_.push({
                serviceParam:CI._id,
                name:CI.name,
                paramListTitle:checkParam_.paramListTitle,
                value:CI.value
              });
            });
          }
        });
        console.log("checkParams_ : ",checkParams_)
      data.checkParams = checkParams_;
      data.decoiler = decoiler
      console.log("data : ",data)
      await dispatch(addMachineServiceRecord(machine?._id,data));
      reset();
      dispatch(setMachineServiceRecordAddFormVisibility(false))
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };


  const toggleCancel = () => { dispatch(setMachineServiceRecordAddFormVisibility(false)) };

  // const handleDropMultiFile = useCallback(
  //   (acceptedFiles) => {
  //     const docFiles = files || [];
  //     const newFiles = acceptedFiles.map((file) =>
  //       Object.assign(file, {
  //         preview: URL.createObjectURL(file),
  //       })
  //     );
  //     setValue('files', [...docFiles, ...newFiles], { shouldValidate: true });
  //   },
  //   [setValue, files ]
  // );

  //  useCallback(
  //   (index,acceptedFiles) => {
  //     console.log(" acceptedFiles : ", acceptedFiles)
  //     const docFiles =  [];
  //     const newFiles = acceptedFiles.map((file) =>
  //       Object.assign(file, {
  //         preview: URL.createObjectURL(file),
  //       })
  //     );

  //     setCheckParam((prevVal) => {
  //       const updatedVal = [...prevVal];
  //       updatedVal[index] = {
  //         files: [...(checkParam[index]?.files ?? []), ...newFiles],
  //         serviceParam: updatedVal[index]?.serviceParam || null,
  //         name: updatedVal[index]?.name || '',
  //         paramListTitle: updatedVal[index]?.paramListTitle || '',
  //         value: updatedVal[index]?.value || '',
  //         comments: updatedVal[index]?.comments || '',
  //       };
  //       return updatedVal; 
  //     });

  //     setValue(`checkParamFiles${index}`, [...docFiles, ...newFiles], { shouldValidate: true });
  //     console.log(`checkParamFiles${index}`)
  //   },
  //   [setValue, checkParam]
  // );

  const handleChangeCheckItemListValue = (index, childIndex, e) => {
    const updatedCheckParams = [...checkParamList];
    const updatedCheckParamObject = updatedCheckParams[index].paramList[childIndex];
    updatedCheckParamObject.value = e.target.value;
    setCheckParamList(updatedCheckParams);
  }
  
  const handleChangeCheckItemListCheckBoxValue = (index, childIndex, e) => {
    const updatedCheckParams = [...checkParamList];
    const updatedCheckParamObject = updatedCheckParams[index].paramList[childIndex];
    updatedCheckParamObject.value =  !updatedCheckParams[index]?.paramList[childIndex]?.value ;
    setCheckParamList(updatedCheckParams);
  }

  return (
      <FormProvider methods={methods}  onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <FormHeading heading={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_RECORD_ADD} />

                  <RHFAutocomplete
                    name="serviceRecordConfig"
                    label="Service Record Configuration"
                    options={activeServiceRecordConfigsForRecords}
                    getOptionLabel={(option) => `${option?.docTitle ?? ''} ${option?.docTitle ? '-' : '' } ${option.recordType ? option.recordType :   ''}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option) => (
                    <li {...props} key={option._id}>{`${option?.docTitle ?? ''} ${option?.docTitle ? '-' : '' } ${option.recordType ? option.recordType : ''}`}</li>
                    )}
                  />

                  
                                  
                <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >

                  <RHFDatePicker name="serviceDate" label="Service Date" />

                  <RHFAutocomplete
                    name="technician"
                    label="Technician"
                    options={activeContacts}
                    getOptionLabel={(option) => `${option.firstName ? option.firstName :   ''} ${option.lastName ? option.lastName :   ''}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option) => (
                    <li {...props} key={option._id}>{`${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName :   ''}`}</li>
                    )}
                  />
                  </Box>
                    <RHFTextField name="operatorRemarks" label="Technican Remarks" minRows={3} multiline/> 
                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >
                    <RHFTextField name="machine" label="Machine" value={`${machine.serialNo} ${machine.name ? '-' : ''} ${machine.name ? machine.name : ''}`} disabled/>
                    <RHFTextField name="machine" label="Machine Model" value={machine?.machineModel?.name || ''} disabled/>
                    <RHFTextField name="machine" label="Machine Model Category" value={machine?.machineModel?.category?.name || ''} disabled/>
                    <RHFTextField name="customer" label="Customer" value={`${machine?.customer?.name ? machine?.customer?.name : ''}`} disabled/>
                  </Box>

                    <Controller
                      name="decoiler"
                      control={control}
                      defaultValue={ decoiler || []}
                      render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        multiple
                        {...field}
                        name="decoiler"
                        id="tags-outlined"
                        options={machineConnections}
                        getOptionLabel={(option) => `${option.serialNo ? option.serialNo : ''} ${option.name ? '-' : ''} ${option.name ? option.name : ''}`}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        onChange={(event, value) => field.onChange(value)}
                        
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            name="decoiler"
                            id="decoiler"  
                            label="Decoilers"  
                            error={!!error}
                            helperText={error?.message} 
                            inputRef={ref}
                            />
                        )}
                      />
                      )}
                    />

                    {checkParamList?.length > 0 && <FormHeading heading={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS_CONSTRCTUION} />}

                    <Grid sx={{display:'flex', flexDirection:'column'}}>
                          {checkParamList?.map((row, index) =>
                          ( typeof row?.paramList?.length === 'number' &&
                          <>
                        <Grid key={index}  item md={12} >
                                <Typography variant="body2"><b>{`${index+1}). `}</b>{typeof row?.paramListTitle === 'string' && row?.paramListTitle || ''}{' ( Items: '}<b>{`${row?.paramList?.length}`}</b>{' ) '}</Typography>
                        </Grid>
                        <Grid  item md={12} >

                          {row?.paramList.map((childRow,childIndex) => (
                            <Box
                              component="form"
                              noValidate
                              autoComplete="off"
                              sx={{pl:4, alignItems: 'center'}}
                              rowGap={2}
                              columnGap={2}
                              display="grid"
                              gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                              >
                              <Typography variant="body2" ><b>{`${childIndex+1}). `}</b>{`${childRow.name}`}</Typography>

                              { childRow?.inputType === 'Short Text' && <TextField 
                                label={childRow?.inputType} 
                                name={childRow?.name} 
                                onChange={(e) => handleChangeCheckItemListValue(index, childIndex, e)}
                                size="small" sx={{m:0.3}} 
                                value={checkParamList[index]?.paramList[childIndex]?.value}
                                required={childRow?.isRequired}
                              />}

                              { childRow?.inputType === 'Long Text' && <TextField 
                                label={childRow?.inputType} 
                                name={childRow?.name} 
                                onChange={(e) => handleChangeCheckItemListValue(index, childIndex, e)}
                                size="small" sx={{m:0.3}} 
                                value={checkParamList[index]?.paramList[childIndex]?.value}
                                minRows={3} multiline
                                required={childRow?.isRequired}
                              />}

                              { childRow?.inputType === 'Number'  && <TextField 
                                id="filled-number"
                                label="Number"
                                name={childRow?.name} 
                                type="number"
                                value={checkParamList[index]?.paramList[childIndex]?.value}
                                onChange={(e) => handleChangeCheckItemListValue(index, childIndex, e)}
                                InputLabelProps={{
                                  shrink: true,
                                }} 
                                size="small" sx={{m:0.3}} 
                                required={childRow?.isRequired}
                              />}
                              
                              {childRow?.inputType === 'Boolean' && 
                              <div>
                              <Checkbox 
                                name={childRow.name} 
                                required={childRow?.isRequired} 
                                checked={checkParamList[index].paramList[childIndex]?.value || false} 
                                onChange={(val)=>handleChangeCheckItemListCheckBoxValue(index, childIndex, val)} 
                                
                              /></div>}

                            </Box>
                          ))}
                        </Grid>
                        </>
                          ))}
                    </Grid>
                                  {/* <CollapsibleCheckedItemInputRow } value={row} index={index} checkParams={checkParams} setValue={setValue} /> */}
                    { serviceRecordConfig?.enableNote && <RHFTextField name="serviceNote" label="Note" minRows={3} multiline/> }

                    { serviceRecordConfig?.enableMaintenanceRecommendations && <RHFTextField name="maintenanceRecommendation" label="Maintenance Recommendation" minRows={3} multiline/> }

                    { serviceRecordConfig?.enableSuggestedSpares && <RHFTextField name="suggestedSpares" label="Suggested Spares" minRows={3} multiline/> }
                    
                    <RHFAutocomplete
                      name="operator"
                      label="Operator"
                      options={activeContacts}
                      getOptionLabel={(option) => `${option.firstName ? option.firstName :   ''} ${option.lastName ? option.lastName :   ''}`}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName :   ''}`}</li>
                    )}
                    />

                  {/* <Grid item xs={12} md={6} lg={12}>
                    <RHFUpload
                      multiple
                      thumbnail
                      name="files"
                      // maxSize={3145728}
                      onDrop={handleDropMultiFile}
                      onRemove={(inputFile) =>
                        files.length > 1 ?
                        setValue(
                          'files',
                          files &&
                            files?.filter((file) => file !== inputFile),
                          { shouldValidate: true }
                        ): setValue('files', '', { shouldValidate: true })
                      }
                      onRemoveAll={() => setValue('files', '', { shouldValidate: true })}
                    />
                  </Grid> */}
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
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
  );
}

export default memo(MachineServiceRecordAddForm)