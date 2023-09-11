import * as Yup from 'yup';
import { useEffect, useMemo, useCallback, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from '@mui/x-date-pickers';
import { Box, Card, Grid, Stack, Typography, Button, TextField, Accordion, AccordionSummary, AccordionDetails, Autocomplete } from '@mui/material';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import FormHeading from '../../components/DocumentForms/FormHeading';
import { FORMLABELS } from '../../../constants/default-constants';
// slice
import { addMachineServiceRecord, setMachineServiceRecordAddFormVisibility } from '../../../redux/slices/products/machineServiceRecord';
import { getMachineConnections } from '../../../redux/slices/products/machineConnections';
import { getActiveMachineServiceParams } from '../../../redux/slices/products/machineServiceParams';
import { getActiveServiceRecordConfigs } from '../../../redux/slices/products/serviceRecordConfig';
import { getActiveSites } from '../../../redux/slices/customer/site';
import { getActiveContacts } from '../../../redux/slices/customer/contact';

// components
// import { NotRequiredValidateFileType } from '../../document/documents/Utills/Util'
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';
import { MachineServiceRecordSchema } from '../../schemas/machine';
import useResponsive from '../../../hooks/useResponsive';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch,
  RHFUpload,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

function MachineServiceRecordAddForm() {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { machine } = useSelector((state) => state.machine)
  console.log("machine : " , machine)
  // const { activeSites } = useSelector((state) => state.site);
  const { activeContacts } = useSelector((state) => state.contact);
  const { activeServiceRecordConfigs } = useSelector((state) => state.serviceRecordConfig);
  // console.log("activeServiceRecordConfigs  : ",activeServiceRecordConfigs)
  const { machineConnections } = useSelector((state) => state.machineConnections);
  // console.log("machineConnections : ",machineConnections)
  const { activeMachineServiceParams } = useSelector((state) => state.machineServiceParam);
  // const { recordTypes } = useSelector((state) => state.machineServiceRecord);
  const [activeIndex, setActiveIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [checkParamNumber, setCheckParamNumber]= useState(1);
  const [checkParam, setCheckParam] = useState([]);
  const isMobile = useResponsive('down', 'sm');

  useEffect( ()=>{
    dispatch(getMachineConnections(machine?.customer?._id))
    dispatch(getActiveServiceRecordConfigs())
    dispatch(getActiveSites(machine?.customer?._id))
    dispatch(getActiveContacts(machine?.customer?._id))
    dispatch(getActiveMachineServiceParams())
  },[dispatch, machine])


  const filesSchema = {};

  // for (let index = 1; index <= checkParamNumber; index += 1 ) {
  //   filesSchema[`checkParamFiles${index}`] = Yup.mixed().test(
  //     'fileType',
  //     'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
  //     NotRequiredValidateFileType
  //   ).nullable(true)
  // }

  Yup.object().shape(filesSchema);

  const defaultValues = useMemo(
    () => {
      const initialValues = {
      serviceRecordConfig: null,
      serviceDate: new Date(),
      customer: null, 
      site: null,
      machine: null,
      decoiler: [],
      technician: null,
      // checkParams:
      serviceNote: '',
      maintenanceRecommendation: '',
      suggestedSpares: '',
      files: [],
      // checkParamFiles: [],
      operator: null,
      operatorRemarks: '',
      isActive: true,
    }

    for (let index = 0; index < checkParamNumber; index += 1) {
      initialValues[`checkParamFiles${index}`] = [];
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

  const {  serviceDate, files, decoiler } = watch()

  
  useEffect(()=>{
    setValue('decoiler',machineConnections)
  },[setValue, machineConnections])
// console.log("decoiler : ",decoiler)
  // console.log("additionalFields : ",{...checkParamFiles})
  // for (let index = 1; index <= checkParamNumber; index += 1) {
  //   checkParamFiles[`checkParamFiles${index}`] = watch(`checkParamFiles${index}`);
  // console.log("checkParamFiles : ",checkParamFiles)
  // }

  const onSubmit = async (data) => {
    try {
      // console.log("data : ",data)
      data.machine = machine?._id
      data.customer = machine?.customer?._id
      data.site = machine?.instalationSite?._id
      await dispatch(addMachineServiceRecord(data));
      reset();
      dispatch(setMachineServiceRecordAddFormVisibility(false))
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };


  const toggleCancel = () => { dispatch(setMachineServiceRecordAddFormVisibility(false)) };

  const handleAccordianClick = (accordianIndex) => {
    if (accordianIndex === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(accordianIndex);
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {setExpanded(isExpanded ? panel : false)};
  // const handleRecordTypeChange = (newValue) => setValue("recordType", newValue)
  const handleServiceDateChange = (newValue) => setValue("serviceDate", newValue)

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      const docFiles = files || [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('files', [...docFiles, ...newFiles], { shouldValidate: true });
    },
    [setValue, files ]
  );

   useCallback(
    (index,acceptedFiles) => {
      console.log(" acceptedFiles : ", acceptedFiles)
      const docFiles =  [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setCheckParam((prevVal) => {
        const updatedVal = [...prevVal];
        updatedVal[index] = {
          files: [...(checkParam[index]?.files ?? []), ...newFiles],
          serviceParam: updatedVal[index]?.serviceParam || null,
          name: updatedVal[index]?.name || '',
          paramListTitle: updatedVal[index]?.paramListTitle || '',
          value: updatedVal[index]?.value || '',
          comments: updatedVal[index]?.comments || '',
        };
        return updatedVal; 
      });

      setValue(`checkParamFiles${index}`, [...docFiles, ...newFiles], { shouldValidate: true });
      console.log(`checkParamFiles${index}`)
    },
    [setValue, checkParam]
  );
  
  return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <FormHeading heading={FORMLABELS.COVER.MACHINE_SERVICE_RECORD_ADD} />
                
                <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >

                  <RHFAutocomplete
                    name="serviceRecordConfig"
                    label="Service Record Configuration"
                    options={activeServiceRecordConfigs}
                    getOptionLabel={(option) => `${option?.docTitle ?? ''} ${option?.docTitle ? '-' : '' } ${option.recordType ? option.recordType :   ''}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option) => (
                    <li {...props} key={option._id}>{`${option?.docTitle ?? ''} ${option?.docTitle ? '-' : '' } ${option.recordType ? option.recordType : ''}`}</li>
                    )}
                  />

                  <DatePicker
                    name="serviceDate"
                    label="Service Date"
                    value={serviceDate}
                    slotProps={{
                      textField: {
                        helperText: 'MM/DD/YYYY',
                      },
                    }}
                    views={['day', 'month','year']}
                    // format="DD-MM-YYYY"
                    format="LL"
                    onChange={handleServiceDateChange}
                    renderInput={params => <TextField {...params}  />}
                  />

                  {/* <RHFAutocomplete
                    name="site"
                    label="Site"
                    options={activeSites}
                    getOptionLabel={(option) => `${option.name ? option.name :   ''}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  /> */}

                  {/* <RHFAutocomplete
                    multiline
                    name="decoiler"
                    label="Decoiler"
                    value={machine?.machineConnections}
                    options={machine?.machineConnections}
                    getOptionLabel={(option) => `${option?.connectedMachine?.serialNo ? option?.connectedMachine?.serialNo : ''} ${option?.name ? '-' : ''} ${option?.name ? option?.name : ''}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option?.connectedMachine?.serialNo ? option?.connectedMachine?.serialNo : ''}  ${option?.name ? '-' : ''} ${option?.name ? option?.name : ''} `}</li>
                    )}
                    ChipProps={{ size: 'small' }}
                  /> */}

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

                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >
                  <RHFAutocomplete
                    name="technician"
                    label="Technician"
                    options={activeContacts}
                    getOptionLabel={(option) => `${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName :   ''}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option) => (
                    <li {...props} key={option._id}>{`${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName :   ''}`}</li>
                  )}
                  />
                </Box>


                <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >
                <FormHeading heading={FORMLABELS.COVER.MACHINE_SERVICE_CHECK_PARAM_RECORD_ADD} />
                <Grid display="flex" justifyContent="flex-end">
                    <Button
                      onClick={ () => setCheckParamNumber(prevCheckParamNumber => prevCheckParamNumber + 1)}
                      fullWidth={ isMobile }
                      // disabled={ compositToolNumber >= CONFIG.COMPOSITE_TOOL_CONFIG_MAX_LENGTH }
                      variant="contained" color='primary' startIcon={<Iconify icon="eva:plus-fill" />} sx={{ ...(isMobile && { width: '100%' })}}
                    >Add more
                    </Button>
                  </Grid> 

                </Box>
                <Card sx={{ border: '0.7px solid lightGray' }} >
                {Array.from({ length: checkParamNumber }).map((note, index) => {
                    const borderTopVal = index !== 0 ? '0.7px solid lightGray' : '';
                    return (
                      <Accordion
                        key={index}
                        expanded={expanded === index}
                        onChange={handleChange(index)}
                        sx={{ borderTop: borderTopVal }}
                      >
                        <AccordionSummary
                          expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                          onClick={() => handleAccordianClick(index)}
                        >
                          {index !== activeIndex ? (
                            <Grid container spacing={0}>
                              <Grid item xs={12} sm={9} md={10}>
                                <Typography>{`Service Parameter ${index+1}: `}</Typography>
                              </Grid>
                            </Grid>
                          ) : null}
                        </AccordionSummary>
                        <AccordionDetails sx={{ mt: -3 }}>
                          <Stack spacing={2}>
                          <Box
                              rowGap={2}
                              columnGap={2}
                              display="grid"
                              gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                            >
                            <RHFAutocomplete
                              name="serviceParam"
                              label="Service Parameter"
                              options={activeMachineServiceParams}
                              getOptionLabel={(option) => `${option.name ? option.name :   ''}`}
                              isOptionEqualToValue={(option, value) => option._id === value._id}
                              renderOption={(props, option) => (
                              <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                              )}
                            />
                            <RHFTextField name="name" label="Name" />
                            <RHFTextField name="paramListTitle" label="Parameter List Title" />
                            <RHFTextField name="value" label="Value" />
                          </Box>
                            <RHFTextField name="comments" label="Comments" minRows={3} multiline />
                            {/* <Grid item xs={12} md={6} lg={12}>
                              <RHFUpload
                                multiple
                                thumbnail
                                name={`checkParamFiles${index}`}
                                // maxSize={3145728}
                                onDrop={(acceptedFiles) => handleDropMultiCheckParamFile(index, acceptedFiles)}
                                onRemove={(inputFile) =>
                                  `checkParamFiles${index}`.length > 1 ?
                                  setValue(
                                    `checkParamFiles${index}`,
                                    `checkParamFiles${index}` &&
                                    `checkParamFiles${index}`?.filter((file) => file !== inputFile),
                                    { shouldValidate: true }
                                  ): setValue(`checkParamFiles${index}`, '', { shouldValidate: true })
                                }
                                onRemoveAll={() => setValue(`checkParamFiles${index}`, '', { shouldValidate: true })}
                              />
                            </Grid> */}
                            </Stack>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                    </Card>
                  

                    <RHFTextField name="maintenanceRecommendation" label="Maintenance Recommendation" minRows={3} multiline/>

                    <RHFTextField name="suggestedSpares" label="Suggested Spares" minRows={3} multiline/>

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

                    <RHFTextField name="operatorRemarks" label="Operator Remarks" minRows={3} multiline/>
                  <RHFTextField name="serviceNote" label="Service Note" minRows={3} multiline/>
                  <Grid item xs={12} md={6} lg={12}>
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
                  </Grid>

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