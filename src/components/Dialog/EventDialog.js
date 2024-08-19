import PropTypes from 'prop-types';
import React,{ useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { enc, MD5, lib } from 'crypto-js';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// @mui
import { Box, Stack, Button, DialogActions, DialogContent, Grid, Dialog, DialogTitle, Container, Divider, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import DragHandleRoundedIcon from '@mui/icons-material/DragHandleRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
// slices
import { setEventModel } from '../../redux/slices/event/event';
import { getActiveCustomerMachines, resetActiveCustomerMachines } from '../../redux/slices/products/machine';
import { getActiveSites, resetActiveSites } from '../../redux/slices/customer/site';
import FormProvider, { RHFDatePicker, RHFTextField, RHFAutocomplete, RHFUpload } from '../hook-form';
import IconTooltip from '../Icons/IconTooltip';
import ConfirmDialog from '../confirm-dialog/ConfirmDialog';
import { fDateTime } from '../../utils/formatTime';
import { time_list } from '../../constants/time-list';
import { useAuthContext } from '../../auth/useAuthContext';
import CustomSwitch from '../custom-input/CustomSwitch';

function getTimeObjectFromISOString(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedValueTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const timeObject = {
    value: formattedValueTime,
    label: `${formattedTime} ${ampm}`
};
return timeObject;
}

const getInitialValues = (selectedEvent, range, contacts) => {
  const initialEvent = {
    _id: selectedEvent ? selectedEvent?._id : null ,
    isCustomerEvent: ( selectedEvent?.isCustomerEvent || selectedEvent?.isCustomerEvent === undefined ) && true || false,
    date: selectedEvent ? selectedEvent?.start : (range?.start || new Date() ) ,
    end_date: selectedEvent ? selectedEvent?.end : (range?.end || new Date() ) ,
    start: selectedEvent ? getTimeObjectFromISOString(selectedEvent?.start) : { value: '07:30', label: '7:30 AM' },
    end: selectedEvent ?  getTimeObjectFromISOString(selectedEvent?.end) : { value: '18:00', label: '6:00 PM' },
    customer: selectedEvent ? selectedEvent?.customer : null,
    priority: selectedEvent ? selectedEvent?.priority : '', 
    machines: selectedEvent ? selectedEvent?.machines :  [],
    site: selectedEvent ? selectedEvent?.site :  null,
    jiraTicket: selectedEvent ? selectedEvent?.jiraTicket :  '',
    primaryTechnician: selectedEvent ? selectedEvent?.primaryTechnician :  null,
    supportingTechnicians: selectedEvent ? selectedEvent?.supportingTechnicians :  [],
    notifyContacts: selectedEvent ? selectedEvent?.notifyContacts :  contacts,
    description: selectedEvent ? selectedEvent?.description :  '',
    files: selectedEvent ? selectedEvent?.files : [],
    createdAt: selectedEvent?.createdAt || '',
    createdByFullName: selectedEvent?.createdBy?.name || '',
    createdIP: selectedEvent?.createdIP || '',
    updatedAt: selectedEvent?.updatedAt || '',
    updatedByFullName: selectedEvent?.updatedBy?.name || '',
    updatedIP: selectedEvent?.updatedIP || '',
  };

  return initialEvent;
};

EventDialog.propTypes = {
  range: PropTypes.object,
  onDeleteEvent: PropTypes.func,
  onCreateUpdateEvent: PropTypes.func,
  colorOptions: PropTypes.arrayOf(PropTypes.string),
  contacts:PropTypes.array
};

function EventDialog({
  range,
  colorOptions,
  onCreateUpdateEvent,
  onDeleteEvent,
  contacts,
}) {
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const { selectedEvent, eventModel } = useSelector((state) => state.event );
  const { activeCustomers } = useSelector((state) => state.customer);
  const { activeContacts, activeSpContacts } = useSelector((state) => state.contact);
  const { activeSites } = useSelector((state) => state.site);
  const { activeCustomerMachines } = useSelector( (state) => state.machine );
  const [ openConfirm, setOpenConfirm ] = useState(false);
  const dialogRef = useRef(null);

  const EventSchema = Yup.object().shape({
    date: Yup.date().nullable().label('Event Date').typeError('End Time should be a valid Date').required(),
    end_date: Yup.date().nullable().label('Event Date').typeError('End Time should be a valid Date').required()
      .test('is-greater-than-start-date', 'End Date must be later than Start Date', (value, context) => {
        const start_date = context.parent.date;
        if (start_date && value) {
          const startDate = new Date(start_date).setHours(0,0,0,0);
          const endDate = new Date(value).setHours(0,0,0,0);
          if(startDate!==endDate){
            clearErrors('end')
          }
          return  startDate <= endDate;
        }
        return true; 
      }),
    start: Yup.object().nullable().label('Start Time').required('Start Time is required'),
    end: Yup.object().nullable().label('End Time').required('End Time is required')
      .test('is-greater-than-start-time-if-same-date', 'End Time must be later than Start Time', (value, context) => {
        const { start, date, end_date } = context.parent;
        if (start && date && end_date && value) {
          let startDate = new Date(date);
          let endDate = new Date(end_date);
          const [start_hours, start_minutes] = start.value.split(':').map(Number);
          const [end_hours, end_minutes] = value.value.split(':').map(Number);
          startDate.setHours(start_hours, start_minutes);
          startDate = new Date(startDate);
          endDate.setHours(end_hours, end_minutes);
          endDate = new Date(endDate);
          if(startDate.getDate()===endDate.getDate()){
            return startDate < endDate;
          }
        }
        return true;
      }),
    jiraTicket: Yup.string().max(200).label('Jira Ticket'),
    customer: Yup.object().nullable().label('Customer').required(),
    priority: Yup.string().label('Priority').required(), 
    machines: Yup.array().nullable().label('Machines'),
    site: Yup.object().nullable().label('Site'),
    primaryTechnician: Yup.object().nullable().label('Primary Technician').required(),
    supportingTechnicians: Yup.array().nullable().label('Supporting Technicians').required(),
    notifyContacts: Yup.array().nullable().label('Notify Contacts').required(),
    description: Yup.string().max(500).label('Description'),
    files: Yup.array().of(Yup.mixed()).nullable().label('Files'), 
  });

  const defaultValues = getInitialValues(selectedEvent?.extendedProps, range, contacts);
  
  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
    clearErrors,
  } = methods;

  useEffect(() => {
    if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
      if(dialogRef.current){
        dialogRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [errors]);

  const { customer, date, isCustomerEvent, files } = watch();

  useEffect(() => {
    const { end_date  } = watch()
    if (date && end_date) {
      const startDate = new Date(date);
      const endDate = new Date(end_date);
      if (startDate > endDate) {
        setValue('end_date', startDate);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ date ])

  useEffect(()=>{
    if(customer){
      dispatch(getActiveCustomerMachines(customer?._id))
      dispatch(getActiveSites(customer?._id))
    } else {
      dispatch(resetActiveCustomerMachines())
      dispatch(resetActiveSites())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ dispatch, customer ])

  useLayoutEffect(() => {
    reset(getInitialValues(selectedEvent?.extendedProps, range, contacts));
  }, [reset, range, selectedEvent, contacts]);
  
  const priorityOptions = [
    { label: 'Highest', value: 'highest' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
    { label: 'Lowest', value: 'lowest' },
  ];

  const onSubmit = async ( data ) => {

    const start_date = new Date(data?.date);
    const end_date = new Date(data?.end_date);
    const [start_hours, start_minutes] = data.start.value.split(':').map(Number);
    const [end_hours, end_minutes] = data.end.value.split(':').map(Number);
    start_date.setHours(start_hours, start_minutes);
    data.start_date = new Date(start_date);
    end_date.setHours(end_hours, end_minutes);
    data.end_date = new Date(end_date);

    try {
      await onCreateUpdateEvent(data);
      setValue("isCustomerEvent", true );
      reset();
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleCloseModel = ()=> {
    dispatch(setEventModel(false)) 
    dispatch(resetActiveCustomerMachines())
    dispatch(resetActiveSites())
    setValue("isCustomerEvent", true );
    reset()
  };

    const handleCustomerEvent = () => {
      setValue( "jiraTicket", "" );
      setValue( "customer", null );
      setValue( "priority", "" );
      setValue( "primaryTechnician", null );
      setValue( "machines", [] );
      setValue( "site", null );
      setValue( "supportingTechnicians", [] );
      setValue( "notifyContacts", [] );
      setValue( "description", "" );
      setValue( "files", [] );
      setValue("isCustomerEvent", !isCustomerEvent);
    };
  
    useEffect( () => {
      if( !isCustomerEvent ){
        if( Array.isArray( activeCustomers ) && activeCustomers?.length > 0 ){
          setValue( 'customer', activeCustomers.find(( cus ) => cus?._id === user?.customer ) );
        }
        if( Array.isArray( activeSpContacts ) && activeSpContacts?.length > 0 ){
          setValue( 'primaryTechnician', activeSpContacts?.find(( con ) => con?._id === user?.contact ) );
        }
      }
    }, [ isCustomerEvent, setValue, activeSpContacts, activeCustomers, user ] );
    
    const getPriorityIcon = (priority) => {
      switch (priority) {
        case 'highest':
          return <KeyboardDoubleArrowUpRoundedIcon color="error" />;
        case 'high':
          return <KeyboardArrowUpRoundedIcon color="error" />;
        case 'medium':
          return <DragHandleRoundedIcon color="warning" />;
        case 'low':
          return <KeyboardArrowDownRoundedIcon color="success" />;
        case 'lowest':
          return <KeyboardDoubleArrowDownRoundedIcon color="success" />;
        default:
          return null;
      }
    };

    const handleDropMultiFile = useCallback( async (acceptedFiles) => {
        const newFiles = acceptedFiles.map((file, index) => 
            Object.assign(file, {
              preview: URL.createObjectURL(file),
              src: URL.createObjectURL(file),
              isLoaded:true
            })
        );
        setValue('files', [ ...newFiles], { shouldValidate: true });
      }, [ setValue ] );

  return (
    <>
      <Dialog
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'flex-start',
          },
          '& .MuiPaper-root': {
            marginTop: 4, 
            marginBottom: 4,
          },
        }}
        fullWidth
        disableEnforceFocus
        maxWidth="lg"
        open={eventModel}
        onClose={handleCloseModel}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          variant="h3"
          sx={{ pb: !selectedEvent ? 0 : '', pt: !selectedEvent ? 0 : '' }}
        >
          {selectedEvent ? 'Update Event' : 'New Event'}
          {!selectedEvent && (
            <DialogActions>
              <CustomSwitch
                label="Customer Visit"
                checked={isCustomerEvent}
                onChange={handleCustomerEvent}
              />
            </DialogActions>
          )}
        </DialogTitle>
        <Divider orientation="horizontal" flexItem />
        <DialogContent dividers sx={{ px: 3 }}>
        <Container maxWidth={false}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container ref={dialogRef}>
              <Stack spacing={2} sx={{ pt: 2 }}>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }}
                >
                  <RHFDatePicker label="Event Date*" name="date" />
                  <RHFAutocomplete
                    label="Start Time*"
                    name="start"
                    options={time_list}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    getOptionLabel={(option) => `${option?.label || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option?.label || ''}`}</li>
                    )}
                  />
                  <RHFDatePicker label="End Date*" name="end_date" />
                  <RHFAutocomplete
                    // disabled={allDay}
                    label="End Time*"
                    name="end"
                    options={time_list}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    getOptionLabel={(option) => `${option?.label || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option?.label || ''}`}</li>
                    )}
                  />
                  {/* <Button sx={{height:'58px'}} variant={allDay?'contained':'outlined'} onClick={()=> handleAllDayChange(!allDay)} 
                  startIcon={<Iconify icon={allDay?'gravity-ui:circle-check':'gravity-ui:circle'}/>}>All Day</Button> */}
                </Box>

                <RHFTextField name="jiraTicket" label={isCustomerEvent ? 'Jira Ticket' : 'Title'} />

                {isCustomerEvent && (
                  <>
                    <RHFAutocomplete
                      label="Customer*"
                      name="customer"
                      options={activeCustomers}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option?._id}>{`${option.name || ''}`}</li>
                      )}
                    />
                    <RHFAutocomplete
                      label="Priority"
                      name="priority"
                      options={priorityOptions}
                      renderOption={(props, option) => <li {...props}> { getPriorityIcon(option.value) } <span style={{ marginLeft: 8 }}>{option.label}</span> </li>}
                      renderInput={(params) => {
                        const selectedOption = priorityOptions.find( (option) => option.label === params.inputProps.value );
                        const selectedIcon = selectedOption ? getPriorityIcon(selectedOption.value) : null;
                        return (
                          <TextField {...params} InputProps={{ ...params.InputProps, startAdornment: selectedIcon, }}
                            label='Priority'
                          />
                        );
                      }}
                    />
                    <RHFAutocomplete
                      multiple
                      disableCloseOnSelect
                      filterSelectedOptions
                      label="Machines"
                      name="machines"
                      options={activeCustomerMachines}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) =>
                        `${option?.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`
                      }
                      renderOption={(props, option) => (
                        <li {...props} key={option?._id}>{`${option?.serialNo || ''} ${
                          option?.name ? '-' : ''
                        } ${option?.name || ''}`}</li>
                      )}
                    />
                    <RHFAutocomplete
                      label="Site"
                      name="site"
                      options={activeSites}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option?._id}>{`${option.name || ''}`}</li>
                      )}
                    />
                  </>
                )}
                <RHFAutocomplete
                  label="Primary Technician*"
                  name="primaryTechnician"
                  options={activeSpContacts}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''}`}
                  renderOption={(props, option) => (
                    <li {...props} key={option?._id}>{`${option?.firstName || ''} ${
                      option?.lastName || ''
                    }`}</li>
                  )}
                />
                {isCustomerEvent && (
                  <>
                    <RHFAutocomplete
                      multiple
                      disableCloseOnSelect
                      filterSelectedOptions
                      label="Supporting Technicians"
                      name="supportingTechnicians"
                      options={activeSpContacts}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) =>
                        `${option.firstName || ''} ${option.lastName || ''}`
                      }
                      renderOption={(props, option) => (
                        <li {...props} key={option?._id}>{`${option?.firstName || ''} ${
                          option?.lastName || ''
                        }`}</li>
                      )}
                    />
                    <RHFAutocomplete
                      multiple
                      disableCloseOnSelect
                      filterSelectedOptions
                      label="Notify Contacts"
                      name="notifyContacts"
                      options={activeSpContacts}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) =>
                        `${option.firstName || ''} ${option.lastName || ''}`
                      }
                      renderOption={(props, option) => (
                        <li {...props} key={option?._id}>{`${option?.firstName || ''} ${
                          option?.lastName || ''
                        }`}</li>
                      )}
                    />
                  </>
                )}
                <RHFTextField name="description" label="Description" multiline rows={3} />
                  <RHFUpload
                    dropZone={false}
                    multiple
                    thumbnail
                    name="files"
                    onDrop={handleDropMultiFile}
                    onRemove={(inputFile) =>
                      files.length > 1
                        ? setValue(
                            'files',
                            files.filter((file) => file !== inputFile),
                            { shouldValidate: true }
                          )
                        : setValue('files', '', { shouldValidate: true })
                    }
                    onRemoveAll={() => setValue('files', '', { shouldValidate: true })}
                  />

                {selectedEvent && (
                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >
                    <Typography variant="body2" color="#919EAB">
                      <b>created by:</b> {`${defaultValues?.createdByFullName || ''}`} <br />{' '}
                      {`${fDateTime(defaultValues.createdAt)} / ${defaultValues.createdIP}`}
                    </Typography>
                    <Typography variant="body2" color="#919EAB">
                      <b>updated by:</b> {`${defaultValues?.updatedByFullName || ''}`} <br />{' '}
                      {`${fDateTime(defaultValues.updatedAt)} / ${defaultValues.updatedIP}`}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Grid>
          </FormProvider>
          </Container>
        </DialogContent>
        <DialogActions>
          {selectedEvent && (
            <IconTooltip
              color="#FF0000"
              title="Delete Event"
              icon="eva:trash-2-outline"
              onClick={() => setOpenConfirm(true)}
            />
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="outlined" color="inherit" onClick={handleCloseModel}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}
          >
            {selectedEvent ? 'Update' : 'Add'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Delete"
        content="Are you sure you want to Delete?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteEvent();
              setOpenConfirm(false);
            }}
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
}

export default EventDialog;
                   
