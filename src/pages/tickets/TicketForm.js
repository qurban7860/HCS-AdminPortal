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
import FormProvider, { RHFTextField, RHFUpload, RHFAutocomplete, RHFDatePicker, RHFSwitch } from '../../components/hook-form';
import { getTicket, postTicket, patchTicket, resetTicket } from '../../redux/slices/ticket/tickets';
import { getActiveCustomerMachines, resetActiveCustomerMachines } from '../../redux/slices/products/machine';
import { getTicketIssueTypes, resetTicketIssueTypes } from '../../redux/slices/ticket/ticketSettings/ticketIssueTypes';
import { getTicketChangeTypes, resetTicketChangeTypes } from '../../redux/slices/ticket/ticketSettings/ticketChangeTypes';
import { getTicketPriorities, resetTicketPriorities } from '../../redux/slices/ticket/ticketSettings/ticketPriorities';
import { getTicketStatuses, resetTicketStatuses } from '../../redux/slices/ticket/ticketSettings/ticketStatuses';
import { getTicketImpacts, resetTicketImpacts } from '../../redux/slices/ticket/ticketSettings/ticketImpacts';
import { getTicketChangeReasons, resetTicketChangeReasons } from '../../redux/slices/ticket/ticketSettings/ticketChangeReasons';
import { getTicketInvestigationReasons, resetTicketInvestigationReasons } from '../../redux/slices/ticket/ticketSettings/ticketInvestigationReasons';
import { getActiveCustomers } from '../../redux/slices/customer/customer';
import { time_list } from '../../constants/time-list';
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
  const { ticketIssueTypes } = useSelector((state) => state.ticketIssueTypes);
  const { ticketChangeTypes } = useSelector((state) => state.ticketChangeTypes); 
  const { ticketPriorities } = useSelector((state) => state.ticketPriorities); 
  const { ticketStatuses } = useSelector((state) => state.ticketStatuses); 
  const { ticketImpacts } = useSelector((state) => state.ticketImpacts); 
  const { ticketInvestigationReasons } = useSelector((state) => state.ticketInvestigationReasons); 
  const { ticketChangeReasons } = useSelector((state) => state.ticketChangeReasons); 

  const defaultValues = useMemo(
    () => ({
      customer: ticket?.customer || null,
      machine: ticket?.machine || null,
      issueType: ticket?.issueType || null,
      summary: ticket?.summary || '',
      description: ticket?.description || '',
      priority: ticket?.priority || null,
      status: ticket?.status || null,
      impact: ticket?.impact || null,
      files: ticket?.files || [],
      changeType: ticket?.changeType || null,
      changeReason: ticket?.changeReason || null,
      implementationPlan: ticket?.implementationPlan || '',
      backoutPlan: ticket?.backoutPlan || '',
      testPlan: ticket?.testPlan || '',
      investigationReason: ticket?.investigationReason || null,
      rootCause: ticket?.rootCause || '',
      workaround: ticket?.workaround || '',
      shareWith: ticket?.shareWith ?? false,
      plannedStartDate: ticket?.plannedStartDate
        ? getTimeObjectFromISOString(ticket.plannedStartDate)
        : getTimeObjectFromISOString(new Date().toISOString()),
      plannedEndDate: ticket?.plannedEndDate
        ? getTimeObjectFromISOString(ticket.plannedEndDate)
        : getTimeObjectFromISOString(new Date().toISOString()),
      dateFrom: new Date(),
      dateTo: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
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
    dispatch(getTicketIssueTypes());
    dispatch(getTicketChangeTypes());
    dispatch(getTicketPriorities());
    dispatch(getTicketStatuses());
    dispatch(getTicketImpacts());
    dispatch(getTicketInvestigationReasons());
    dispatch(getTicketChangeReasons());
    return ()=> { 
      dispatch(resetTicketIssueTypes()); 
      dispatch(resetTicketChangeTypes()); 
      dispatch(resetTicketPriorities()); 
      dispatch(resetTicketStatuses())
      dispatch(resetTicketImpacts()); 
      dispatch(resetTicketInvestigationReasons());
      dispatch(resetTicketChangeReasons())
    }
  }, [dispatch]);  
  
  useEffect(() => {
    if (customer) {
      dispatch(getActiveCustomerMachines(customer._id));
    } else {
      dispatch(resetActiveCustomerMachines());
    }
  }, [dispatch, customer]);
  
  useEffect(() => {
    setValue('status', ticketStatuses.find((element) => element.name === 'To Do') )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ ticketStatuses ])

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
      const fetchData = {
        ...data,
        issueType: data.issueType?._id || null, 
        priority: data.priority?._id || null, 
        status: data.status?._id || null, 
        impact: data.impact?._id || null, 
        changeType: data.changeType?._id || null, 
        changeReason: data.changeReason?._id || null, 
        investigationReason: data.investigationReason?._id || null, 
      };
  
      if (id) {
        await dispatch(patchTicket(id, fetchData));
        dispatch(getTicket(id));
        enqueueSnackbar('Ticket Updated Successfully!', { variant: 'success' });
        navigate(PATH_SUPPORT.supportTickets.view(id));
      } else { 
        await dispatch(postTicket(fetchData));
        enqueueSnackbar('Ticket Added Successfully!', { variant: 'success' });
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
                    label="Issue Type"
                    options={ticketIssueTypes || []}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name || ''} </li> )}
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
                <RHFTextField name="summary" label="Summary*" minRows={1} />
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
                    label="Priority"
                    options={ticketPriorities || []}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li> )}
                  />
                  <RHFAutocomplete
                    name="status"
                    label="Status"
                    options={ticketStatuses || []}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li> )}
                  />
                  <RHFAutocomplete
                    name="impact"
                    label="Impact"
                    options={ticketImpacts || []}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li> )}
                  />
                  {issueType?.name === 'Change Request' && (
                  <>
                  <RHFAutocomplete
                    name="changeType"
                    label="Change Type"
                    options={ticketChangeTypes || []}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li> )}
                  />
                  <RHFAutocomplete
                    name="changeReason"
                    label="Change Reason"
                    options={ticketChangeReasons || []}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li> )}
                  />
                  <RHFTextField name="implementationPlan" label="Implementation Plan" minRows={4} multiline />
                  <RHFTextField name="backoutPlan" label="Backout Plan" minRows={4} multiline />
                  <RHFTextField name="testPlan" label="Test Plan" minRows={4} multiline />
                  </>
                )}
                 {issueType?.name === 'System Incident' && (
                    <>
                   <RHFAutocomplete
                    name="investigationReason"
                    label="Investigation Reason"
                    options={ticketInvestigationReasons || []}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li> )}
                  />
                  <RHFTextField name="rootCause" label="Root Cause" minRows={4} multiline />
                  <RHFTextField name="workaround" label="Workaround" minRows={4} multiline />
                  </>
                )}
                </Box>
                {issueType?.name === 'Change Request' && (
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }}
                >
                  <RHFDatePicker
                    label="Planned Start Date"
                    name="dateFrom"
                    value={dateFrom}
                    onChange={(newValue) => {
                      setValue('dateFrom', newValue);
                      trigger(['dateFrom', 'dateTo']);
                    }}
                  />
                  <RHFAutocomplete
                    label="Planned Start Time"
                    name="plannedStartDate"
                    options={time_list}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    getOptionLabel={(option) => `${option?.label || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option?.label || ''}`}</li>
                    )}
                  />
                  <RHFDatePicker
                    label="Planned End Date"
                    name="dateTo"
                    value={dateTo}
                    onChange={(newValue) => {
                      setValue('dateTo', newValue);
                      trigger(['dateFrom', 'dateTo']);
                    }}
                  />
                  <RHFAutocomplete
                    label="Planned End Time"
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
                  <RHFSwitch name="shareWith" label="Shared With Organization" />
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