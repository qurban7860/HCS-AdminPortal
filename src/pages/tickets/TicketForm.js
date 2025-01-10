import { useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Container, Card, Grid, Stack, Typography } from '@mui/material';
// components
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { PATH_SUPPORT } from '../../routes/paths';
import { useSnackbar } from '../../components/snackbar';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { AddTicketSchema } from '../schemas/ticketSchema';
import options from './utils/constant';
import FormProvider, { RHFTextField, RHFUpload, RHFAutocomplete, RHFDatePicker, RHFSwitch } from '../../components/hook-form';
import { getTicket, postTicket, patchTicket, resetTicket } from '../../redux/slices/ticket/tickets';
import { getActiveCustomerMachines, resetActiveCustomerMachines } from '../../redux/slices/products/machine';
import { getActiveCustomers } from '../../redux/slices/customer/customer';
import { time_list } from '../../constants/time-list';
import RenderCustomInput from '../../components/custom-input/RenderCustomInput';
import PriorityIcon from '../calendar/utils/PriorityIcon';
import { StatusColor } from '../calendar/utils/StatusColor';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

function getTimeObjectFromISOString(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedValueTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const timeObject = {value: formattedValueTime, label: `${formattedTime} ${ampm}`};
  return timeObject;
}

export default function TicketForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { activeCustomerMachines } = useSelector((state) => state.machine);
  const { activeCustomers } = useSelector((state) => state.customer);
  const { ticket } = useSelector((state) => state.tickets); 
  const { 
    changeReasonOptions, 
    impactOptions, 
    priorityOptions, 
    statusOptions,
    reasonOptions, 
    typeOptions, 
    issueTypeOptions 
  } = options;

  const defaultValues = useMemo(
    () => ({
      customer: ticket?.customer || null,
      machine: ticket?.machine || null,
      issueType: ticket?.issueType || '',
      summary: ticket?.summary || '',
      description: ticket?.description || '',
      priority: ticket?.priority || '',
      status: ticket?.status || 'To Do',
      impact: ticket?.impact || '',
      files: ticket?.files || [],
      changeType: ticket?.changeType || '',
      changeReason: ticket?.changeReason || '',
      implementationPlan: ticket?.implementationPlan || '',
      backoutPlan: ticket?.backoutPlan || '',
      testPlan: ticket?.testPlan || '',
      investigationReason: ticket?.investigationReason || '',
      rootCause: ticket?.rootCause || '',
      workaround: ticket?.workaround || '',
      shareWith: ticket?.shareWith ?? true,
      plannedStartDate: ticket?.plannedStartDate
        ? getTimeObjectFromISOString(ticket.plannedStartDate)
        : getTimeObjectFromISOString(new Date().toISOString()),
      plannedEndDate: ticket?.plannedEndDate
        ? getTimeObjectFromISOString(ticket.plannedEndDate)
        : getTimeObjectFromISOString(new Date().toISOString()),
      dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      dateTo: new Date(),
    }),
    [ ticket ] 
  );

  const methods = useForm({
    resolver: yupResolver(AddTicketSchema),
    defaultValues,
  });

  const { reset, handleSubmit, watch, setValue, trigger, formState: { isSubmitting, errors }} = methods;

  const { issueType, customer, files, dateFrom, dateTo } = watch();
  
  useEffect(() => {
    dispatch(getActiveCustomers());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (customer) {
      dispatch(getActiveCustomerMachines(customer._id));
    } else {
      dispatch(resetActiveCustomerMachines());
    }
  }, [dispatch, customer]);

   const handleCustomerChange = useCallback((newCustomer) => {
      setValue('customer', newCustomer);
      setValue('machine', null);
      trigger(['customer', 'machine']);
    }, [setValue, trigger]);
  
    const handleMachineChange = useCallback((newMachine) => {
      setValue('machine', newMachine);
      trigger('machine');
    }, [setValue, trigger]);

  const handleDropMultiFile = useCallback(
    async (acceptedFiles) => {
      const docFiles = files || [];

      const newFiles = acceptedFiles.map((file, index) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          src: URL.createObjectURL(file),
          isLoaded: true,
        })
      );
      setValue('files', [...docFiles, ...newFiles], { shouldValidate: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files]
  );
  
  const onSubmit = async (data) => {
    try {
      if (id) { 
        await dispatch(patchTicket(id, data)); 
        dispatch(getTicket(id)); 
        enqueueSnackbar('Ticket Updated Successfully!');
        navigate(PATH_SUPPORT.supportTickets.view(id));
      } else {
        await dispatch(postTicket(data));
        enqueueSnackbar('Ticket Added Successfully!');
        navigate(PATH_SUPPORT.supportTickets.root);
      }
      reset();
      dispatch(resetTicket());
    } catch (error) {
      enqueueSnackbar(error.message || 'An error occurred', { variant: 'error' });
      console.error(error);
    }
  };  
  
  const toggleCancel = () => {
    dispatch(resetTicket())
    navigate(PATH_SUPPORT.supportTickets.root);
  }

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
      <Cover name={ticket?.customer?.name || 'New Support Ticket'} />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3, pt: 2 }}>
                <ViewFormEditDeleteButtons
                  backLink={() => { 
                    dispatch(resetTicket()) 
                    navigate(PATH_SUPPORT.supportTickets.root)}
                  }
                />
                <Stack spacing={3} sx={{ mt: 1 }}>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <RHFAutocomplete
                    name="customer"
                    label="Customer*"
                    options={activeCustomers || []}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option?.name || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>
                        {' '}
                        {option?.name || ''}{' '}
                      </li>
                    )}
                    onChange={(e, newValue) => handleCustomerChange(newValue)}
                  />
                  <RHFAutocomplete
                    name="machine"
                    label="Machine"
                    options={activeCustomerMachines || []}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) =>
                      `${option.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option.serialNo || ''} ${
                        option?.name ? '-' : ''
                      } ${option?.name || ''}`}</li>
                    )}
                    onChange={(e, newValue) => handleMachineChange(newValue)}
                  />
                </Box>
                  <RHFAutocomplete
                    name="issueType"
                    options={issueTypeOptions}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <RenderCustomInput label="Issue Type" params={params} />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {' '}
                        <span style={{ marginLeft: 8 }}>{option}</span>{' '}
                      </li>
                    )}
                  />
                </Stack>
              </Card>
            </Grid>
        </Grid>
        {issueType && (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="summary" label="Summary*" minRows={1} multiline />
                <RHFTextField name="description" label="Description" minRows={3} multiline />
                <Box
                  sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(1, 1fr)' },
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Box sx={{ mt: 0 }}>
                    <Typography variant="body1" sx={{ mb: 1, ml: 1 }}>
                      Attachment
                    </Typography>
                    <RHFUpload
                      multiple
                      thumbnail
                      name="files"
                      imagesOnly
                      onDrop={handleDropMultiFile}
                      onRemove={(inputFile) => files.length > 1 ? setValue( 'files', files && files?.filter((file) => file !== inputFile), { shouldValidate: true }) : setValue('files', '', { shouldValidate: true })}
                      onRemoveAll={() => setValue('files', '', { shouldValidate: true })}
                    />{' '}
                  </Box>
                  <RHFAutocomplete
                    name="priority"
                    options={priorityOptions}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => <RenderCustomInput label="Priority" params={params} />}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {' '}
                        <PriorityIcon priority={option} />{' '}
                        <span style={{ marginLeft: 8 }}>{option}</span>{' '}
                      </li>
                    )}
                  />
                  <RHFAutocomplete
                    name="status"
                    options={statusOptions}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <RenderCustomInput
                       label="Status"
                       params={{ ...params, error: !!errors?.status, helperText: errors?.status?.message, 
                        InputProps: {
                        ...params.InputProps,
                        style: { 
                        ...params.InputProps.style, 
                        color: StatusColor(params.InputProps.value) }},
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option} style={{ fontWeight: 'bold', color: StatusColor(option) }}>
                        {option}
                      </li>
                    )}
                    rules={{ required: 'Status is required' }}
                  />
                  <RHFAutocomplete
                    name="impact"
                    options={impactOptions}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => <RenderCustomInput label="Impact" params={params} />}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {' '}
                        <span style={{ marginLeft: 8 }}>{option}</span>{' '}
                      </li>
                    )}
                  />
                   {issueType === 'Change Request' && (
                  <>
                  <RHFAutocomplete
                    name="changeType"
                    options={typeOptions}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <RenderCustomInput label="Change Type" params={params} />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {' '}
                        <span style={{ marginLeft: 8 }}>{option}</span>{' '}
                      </li>
                    )}
                  />
                  <RHFAutocomplete
                    name="changeReason"
                    options={changeReasonOptions}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <RenderCustomInput label="Change Reason" params={params} />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {' '}
                        <PriorityIcon priority={option} />{' '}
                        <span style={{ marginLeft: 8 }}>{option}</span>{' '}
                      </li>
                    )}
                  />
                  <RHFTextField name="implementationPlan" label="Implementation Plan" minRows={4} multiline />
                  <RHFTextField name="backoutPlan" label="Backout Plan" minRows={4} multiline />
                  <RHFTextField name="testPlan" label="Test Plan" minRows={4} multiline />
                  </>
                )}
                 {issueType === 'System Incident' && (
                    <>
                  <RHFAutocomplete
                    name="investigationReason"
                    options={reasonOptions}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <RenderCustomInput label="Investigation reason" params={params} />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        {' '}
                        <span style={{ marginLeft: 8 }}>{option}</span>{' '}
                      </li>
                    )}
                  />
                  <RHFTextField name="rootCause" label="Root cause" minRows={4} multiline />
                  <RHFTextField name="workaround" label="Workaround" minRows={4} multiline />
                  </>
                )}
                </Box>
                {issueType === 'Change Request' && (
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }}
                >
                  <RHFDatePicker
                    label="Planned start date"
                    name="dateFrom"
                    value={dateFrom}
                    onChange={(newValue) => {
                      setValue('dateFrom', newValue);
                      trigger(['dateFrom', 'dateTo']);
                    }}
                  />
                  <RHFAutocomplete
                    label="Planned start time"
                    name="plannedStartDate"
                    options={time_list}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    getOptionLabel={(option) => `${option?.label || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option?.label || ''}`}</li>
                    )}
                  />
                  <RHFDatePicker
                    label="Planned end date"
                    name="dateTo"
                    value={dateTo}
                    onChange={(newValue) => {
                      setValue('dateTo', newValue);
                      trigger(['dateFrom', 'dateTo']);
                    }}
                  />
                  <RHFAutocomplete
                    label="Planned end time"
                    name="plannedEndDate"
                    options={time_list}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    getOptionLabel={(option) => `${option?.label || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option?.label || ''}`}</li>
                    )}
                  />
                </Box>
                )}
                <Grid display="flex" alignItems="end">
                  <RHFSwitch name="shareWith" label="Shared with organization" />
                </Grid>
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
       )}
      </FormProvider>
    </Container>
  );
}