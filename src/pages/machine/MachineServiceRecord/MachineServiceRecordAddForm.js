import * as Yup from 'yup';
import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from '@mui/x-date-pickers';
import { Box, Card, Grid, Stack, Typography, Container, TextField } from '@mui/material';
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
import { useSnackbar } from '../../../components/snackbar';
import { MachineServiceRecordSchema } from '../../schemas/machine';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch,
  RHFUpload,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function MachineServiceRecordAddForm() {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { machine } = useSelector((state) => state.machine)
  const { activeSites } = useSelector((state) => state.site);
  const { activeContacts } = useSelector((state) => state.contact);
  const { activeServiceRecordConfigs } = useSelector((state) => state.serviceRecordConfig);
  const { machineConnections } = useSelector((state) => state.machineConnections);
  const { activeMachineServiceParams } = useSelector((state) => state.machineServiceParam);

  useEffect(()=>{
    dispatch(getMachineConnections(machine?.customer?._id))
    dispatch(getActiveServiceRecordConfigs())
    dispatch(getActiveSites(machine?.customer?._id))
    dispatch(getActiveContacts(machine?.customer?._id))
    dispatch(getActiveMachineServiceParams())
  },[dispatch, machine])

  const defaultValues = useMemo(
    () => ({
      recordType: null,
      serviceRecordConfig: null,
      serviceDate: null,
      customer: null, 
      site: null,
      machine: null,
      decoiler: null,
      technician: null,
      // checkParams:
      serviceNote: '',
      maintenanceRecommendation: '',
      suggestedSpares: '',
      files: [],
      checkParamFiles: [],
      operator: null,
      operatorRemarks: '',
      isArchived: false,
    }),
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
  } = methods;
  const { recordType, serviceDate, files, checkParamFiles } = watch()

  const onSubmit = async (data) => {
    try {
      // console.log("data : ",data)
      data.machine = machine?._id
      data.customer = machine?.customer?._id
      await dispatch(addMachineServiceRecord(data));
      reset();
      dispatch(setMachineServiceRecordAddFormVisibility(false))
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };


  const toggleCancel = () => { dispatch(setMachineServiceRecordAddFormVisibility(false)) };

  const handleRecordTypeChange = (newValue) => setValue("recordType", newValue)

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

  const handleDropMultiCheckParamFile = useCallback(
    (acceptedFiles) => {
      const docFiles = files || [];
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setValue('checkParamFiles', [...docFiles, ...newFiles], { shouldValidate: true });
    },
    [setValue, files ]
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

                  <DatePicker
                    name="recordType"
                    label="Record Type"
                    value={recordType}
                    onChange={handleRecordTypeChange}
                    renderInput={params => <TextField {...params}  />}
                  />

                  <RHFAutocomplete
                    name="serviceRecordConfig"
                    label="Service Record Configuration"
                    options={activeServiceRecordConfigs}
                    getOptionLabel={(option) => `${option.recordType ? option.recordType :   ''}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option) => (
                    <li {...props} key={option._id}>{`${option.recordType ? option.recordType : ''}`}</li>
                    )}
                  />

                  <DatePicker
                    name="serviceDate"
                    label="Service Date"
                    value={serviceDate}
                    onChange={handleServiceDateChange}
                    renderInput={params => <TextField {...params}  />}
                  />

                  <RHFAutocomplete
                    name="site"
                    label="Site"
                    options={activeSites}
                    getOptionLabel={(option) => `${option.name ? option.name :   ''}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />

                  <RHFAutocomplete
                    name="decoiler"
                    label="Decoiler"
                    options={machineConnections}
                    getOptionLabel={(option) => `${option?.serialNo ? option?.serialNo : ''} ${option?.name ? '-' : ''} ${option?.name ? option?.name : ''}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.serialNo ? option.serialNo : ''}  ${option?.name ? '-' : ''} ${option?.name ? option?.name : ''} `}</li>
                    )}
                  />

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

                  <RHFTextField name="maintenanceRecommendation" label="Maintenance Recommendation" />

                  <RHFTextField name="suggestedSpares" label="Suggested Spares" />
                  
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

                  <RHFTextField name="operatorRemarks" label="Operator Remarks" />


                </Box>
                <FormHeading heading={FORMLABELS.COVER.MACHINE_SERVICE_CHECK_PARAM_RECORD_ADD} />
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

                  <Grid item xs={12} md={6} lg={12}>
                    <RHFUpload
                      multiple
                      thumbnail
                      name="checkParamFiles"
                      // maxSize={3145728}
                      onDrop={handleDropMultiCheckParamFile}
                      onRemove={(inputFile) =>
                        checkParamFiles.length > 1 ?
                        setValue(
                          'checkParamFiles',
                          checkParamFiles &&
                            checkParamFiles?.filter((file) => file !== inputFile),
                          { shouldValidate: true }
                        ): setValue('checkParamFiles', '', { shouldValidate: true })
                      }
                      onRemoveAll={() => setValue('checkParamFiles', '', { shouldValidate: true })}
                    />
                  </Grid>


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
