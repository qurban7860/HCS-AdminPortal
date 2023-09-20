import {  useEffect, useCallback, useMemo, memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography, TableContainer, Table, TableBody, TextField, Autocomplete } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { v4 as uuidv4 } from 'uuid';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
// slice
import { updateMachineServiceRecord, setMachineServiceRecordViewFormVisibility, getMachineServiceRecord } from '../../../redux/slices/products/machineServiceRecord';
import { getMachineConnections } from '../../../redux/slices/products/machineConnections';
import { getActiveServiceRecordConfigs } from '../../../redux/slices/products/serviceRecordConfig';
import { getActiveContacts } from '../../../redux/slices/customer/contact';
// routes
// import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// import Iconify from '../../../components/iconify';
import FormHeading from '../../components/DocumentForms/FormHeading';
import { FORMLABELS } from '../../../constants/default-constants';
import { MachineServiceRecordSchema } from '../../schemas/machine';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFAutocomplete,
} from '../../../components/hook-form';
import CollapsibleCheckedItemRow from '../ServiceRecordConfig/CollapsibleCheckedItemRow'

// ----------------------------------------------------------------------

function MachineServiceRecordEditForm() {

  const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
  const { activeContacts } = useSelector((state) => state.contact);
  const { activeServiceRecordConfigs } = useSelector((state) => state.serviceRecordConfig);
  const { machineConnections } = useSelector((state) => state.machineConnections);
  const { machine } = useSelector((state) => state.machine);
  const [checkParam, setCheckParam] = useState([]);
  const [serviceDateError, setServiceDateError] = useState('');

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect( ()=>{
    dispatch(getMachineConnections(machine?.customer?._id))
    dispatch(getActiveServiceRecordConfigs())
    dispatch(getActiveContacts(machine?.customer?._id))
  },[dispatch, machine])

  const defaultValues = useMemo(
    () => ({

      recordType:                 machineServiceRecord?.recordType || null,
      serviceRecordConfig:        machineServiceRecord?.serviceRecordConfig || null,
      serviceDate:                machineServiceRecord?.serviceDate || null,
      customer:                   machineServiceRecord?.customer || null, 
      site:                       machineServiceRecord?.site || null,
      machine:                    machineServiceRecord?.machine || null,
      decoiler:                   machineServiceRecord?.decoilers || null,
      technician:                 machineServiceRecord?.technician || null,
      // checkParams:     
      serviceNote:                machineServiceRecord?.serviceNote || '',
      maintenanceRecommendation:  machineServiceRecord?.maintenanceRecommendation || '',
      suggestedSpares:            machineServiceRecord?.suggestedSpares || '',
      // files: machineServiceRecord?.files || [],
      operator:                   machineServiceRecord?.operator || null,
      operatorRemarks:            machineServiceRecord?.operatorRemarks || '',
      isActive:                   machineServiceRecord?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [machineServiceRecord, machine]
  );

  const methods = useForm({
    resolver: yupResolver(MachineServiceRecordSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const {  serviceDate, files, decoiler, serviceRecordConfig } = watch()

  const handleServiceDateChange = (newValue) => setValue("serviceDate", newValue)

  useEffect(() => {
    if (machineServiceRecord) {
      reset(defaultValues);
    }
  }, [machineServiceRecord, reset, defaultValues]);

  const toggleCancel = () => 
  {
    dispatch(setMachineServiceRecordViewFormVisibility(true));
  };

  const onSubmit = async (data) => {
    try {
      data.decoiler = decoiler
      console.log("data : ",data)
      await dispatch(updateMachineServiceRecord(machine?._id ,machineServiceRecord?._id , data));
      reset();
      dispatch(setMachineServiceRecordViewFormVisibility(true));
      await dispatch(getMachineServiceRecord(machine?._id, machineServiceRecord?._id))
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };

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
            <FormHeading heading={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_RECORD_EDIT} />

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

              {serviceRecordConfig?.checkParams?.length > 0 && <FormHeading heading={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAMS} />}

                <TableContainer >
                    <Table>
                        <TableBody>
              {serviceRecordConfig?.checkParams.map((row, index) =>
              ( typeof row?.paramList?.length === 'number' &&
                            <CollapsibleCheckedItemRow key={uuidv4()} value={row} index={index} />
              ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                              
            <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
              >

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

                <RHFTextField name="operatorRemarks" label="Operator Remarks" minRows={3} multiline/> 

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

export default memo(MachineServiceRecordEditForm)