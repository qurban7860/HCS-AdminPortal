import PropTypes from 'prop-types';
import React,{ useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions, DialogContent, Grid, Dialog, DialogTitle, Divider, MenuItem, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';

// components
import { setEventModel } from '../../redux/slices/event/event';
import DialogLink from './DialogLink';
import Iconify from '../iconify';
import { getActiveCustomerMachines, resetActiveCustomerMachines } from '../../redux/slices/products/machine';
import { getActiveSites, resetActiveSites } from '../../redux/slices/customer/site';
import FormProvider, { RHFDatePicker, RHFTimePicker, RHFTextField, RHFAutocomplete, RHFSwitch } from '../hook-form';
import IconTooltip from '../Icons/IconTooltip';
import ConfirmDialog from '../confirm-dialog/ConfirmDialog';
import ViewFormAudit from '../ViewForms/ViewFormAudit';
import ViewFormField from '../ViewForms/ViewFormField';
import { fDateTime } from '../../utils/formatTime';

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
    date: selectedEvent ? selectedEvent?.start : (range?.start || new Date() ) ,
    end_date: selectedEvent ? selectedEvent?.end : (range?.start || new Date() ) ,
    start: selectedEvent ? getTimeObjectFromISOString(selectedEvent?.start) : { value: '07:30', label: '7:30 AM' },
    end: selectedEvent ?  getTimeObjectFromISOString(selectedEvent?.end) : { value: '18:00', label: '6:00 PM' },
    customer: selectedEvent ? selectedEvent?.customer : null,
    machines: selectedEvent ? selectedEvent?.machines :  [],
    site: selectedEvent ? selectedEvent?.site :  null,
    jiraTicket: selectedEvent ? selectedEvent?.jiraTicket :  '',
    primaryTechnician: selectedEvent ? selectedEvent?.primaryTechnician :  null,
    supportingTechnicians: selectedEvent ? selectedEvent?.supportingTechnicians :  [],
    notifyContacts: selectedEvent ? selectedEvent?.notifyContacts :  contacts,
    description: selectedEvent ? selectedEvent?.description :  '',
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
  contacts
}) {
  
  const dispatch = useDispatch();
  const { selectedEvent, eventModel } = useSelector((state) => state.event );
  const { activeCustomers } = useSelector((state) => state.customer);
  const { activeContacts, activeSpContacts } = useSelector((state) => state.contact);
  const { activeSites } = useSelector((state) => state.site);
  const { activeCustomerMachines } = useSelector( (state) => state.machine );
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isPersonalMode, setIsPersonalMode] = useState(false);
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
        return true; // If start_date or end_date is not defined, skip this test
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
        return true; // If start or end is not defined, skip this test
      }),
    jiraTicket: Yup.string().max(200).label('Jira Ticket'),
    customer: Yup.object().nullable().label('Customer').required(),
    machines: Yup.array().nullable().label('Machines'),
    site: Yup.object().nullable().label('Site'),
    primaryTechnician: Yup.object().nullable().label('Primary Technician').required(),
    supportingTechnicians: Yup.array().nullable().label('Supporting Technicians').required(),
    notifyContacts: Yup.array().nullable().label('Notify Contacts').required(),
    description: Yup.string().max(500).label('Description'),
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
    control,
    handleSubmit,
    formState: { isSubmitting, isSubmitted, errors },
    clearErrors,
    setError
  } = methods;

  useEffect(() => {
    if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
      if(dialogRef.current){
        dialogRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [errors]);

  const { jiraTicket, customer, start, end, date, primaryTechnician } = watch();

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

    const [activeButton, setActiveButton] = useState('services');
  
    const handleServicesClick = () => {
      setIsPersonalMode(false);
      setActiveButton('services');
    };
  
    const handlePersonalClick = () => {
      setIsPersonalMode(true);
      setActiveButton('personal');
    };
  

  const onSubmit = (data) => {
    const start_date = new Date(data?.date);
    const end_date = new Date(data?.end_date);
    const [start_hours, start_minutes] = data.start.value.split(':').map(Number);
    const [end_hours, end_minutes] = data.end.value.split(':').map(Number);
    
    start_date.setHours(start_hours, start_minutes);
    data.start_date = new Date(start_date);
    
    end_date.setHours(end_hours, end_minutes);
    data.end_date = new Date(end_date);

    try {
      onCreateUpdateEvent(data);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModel = async ()=> {
    await dispatch(setEventModel(false)) 
    await dispatch(resetActiveCustomerMachines())
    await dispatch(resetActiveSites())
    reset()
  };

  useEffect(() => {
    if (eventModel) {
      handleServicesClick(false); 
    }
  }, [eventModel]);

 const time_list = [
      { _id:'1', value: '00:00', label: '12:00 AM' },
      { _id:'2', value: '00:30', label: '12:30 AM' },
      { _id:'3', value: '01:00', label: '1:00 AM' },
      { _id:'4', value: '01:30', label: '1:30 AM' },
      { _id:'5', value: '02:00', label: '2:00 AM' },
      { _id:'6', value: '02:30', label: '2:30 AM' },
      { _id:'7', value: '03:00', label: '3:00 AM' },
      { _id:'8', value: '03:30', label: '3:30 AM' },
      { _id:'9', value: '04:00', label: '4:00 AM' },
      { _id:'10', value: '04:30', label: '4:30 AM' },
      { _id:'11', value: '05:00', label: '5:00 AM' },
      { _id:'12', value: '05:30', label: '5:30 AM' },
      { _id:'13', value: '06:00', label: '6:00 AM' },
      { _id:'14', value: '06:30', label: '6:30 AM' },
      { _id:'15', value: '07:00', label: '7:00 AM' },
      { _id:'16', value: '07:30', label: '7:30 AM' },
      { _id:'17', value: '08:00', label: '8:00 AM' },
      { _id:'18', value: '08:30', label: '8:30 AM' },
      { _id:'19', value: '09:00', label: '9:00 AM' },
      { _id:'20', value: '09:30', label: '9:30 AM' },
      { _id:'21', value: '10:00', label: '10:00 AM' },
      { _id:'22', value: '10:30', label: '10:30 AM' },
      { _id:'23', value: '11:00', label: '11:00 AM' },
      { _id:'24', value: '11:30', label: '11:30 AM' },
      { _id:'25', value: '12:00', label: '12:00 PM' },
      { _id:'26', value: '12:30', label: '12:30 PM' },
      { _id:'27', value: '13:00', label: '1:00 PM' },
      { _id:'28', value: '13:30', label: '1:30 PM' },
      { _id:'29', value: '14:00', label: '2:00 PM' },
      { _id:'30', value: '14:30', label: '2:30 PM' },
      { _id:'31', value: '15:00', label: '3:00 PM' },
      { _id:'32', value: '15:30', label: '3:30 PM' },
      { _id:'33', value: '16:00', label: '4:00 PM' },
      { _id:'34', value: '16:30', label: '4:30 PM' },
      { _id:'35', value: '17:00', label: '5:00 PM' },
      { _id:'36', value: '17:30', label: '5:30 PM' },
      { _id:'37', value: '18:00', label: '6:00 PM' },
      { _id:'38', value: '18:30', label: '6:30 PM' },
      { _id:'39', value: '19:00', label: '7:00 PM' },
      { _id:'40', value: '19:30', label: '7:30 PM' },
      { _id:'41', value: '20:00', label: '8:00 PM' },
      { _id:'42', value: '20:30', label: '8:30 PM' },
      { _id:'43', value: '21:00', label: '9:00 PM' },
      { _id:'44', value: '21:30', label: '9:30 PM' },
      { _id:'45', value: '22:00', label: '10:00 PM' },
      { _id:'46', value: '22:30', label: '10:30 PM' },
      { _id:'47', value: '23:00', label: '11:00 PM' },
      { _id:'48', value: '23:30', label: '11:30 PM' }
    ]

  return (
    <>
      <Dialog
        fullWidth
        disableEnforceFocus
        maxWidth="md"
        open={eventModel}
        onClose={handleCloseModel}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle display='flex' justifyContent='space-between' alignItems='center' variant='h3' sx={{pb:0, pt:0 }}>
          {selectedEvent ? 'Update Event' : 'New Event'}
          <DialogActions>
            <Button
              variant="contained"
              onClick={handleServicesClick}
              sx={{
                bgcolor: activeButton === 'services' ? 'primary.main' : 'grey.300',
                color: activeButton === 'services' ? 'white' : 'black',
                '&:hover': { bgcolor: activeButton === 'services' ? 'primary.dark' : 'grey.400' },
              }}
            >
              Services
            </Button>
            <Button
              variant="contained"
              onClick={handlePersonalClick}
              sx={{
                bgcolor: activeButton === 'personal' ? 'primary.main' : 'grey.300',
                color: activeButton === 'personal' ? 'white' : 'black',
                '&:hover': { bgcolor: activeButton === 'personal' ? 'primary.dark' : 'grey.400' },
              }}
            >
              Personal
            </Button>
          </DialogActions>
        </DialogTitle>
        <Divider orientation="horizontal" flexItem />
        <DialogContent dividers sx={{px:3 }} >
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container ref={dialogRef} >
              <Stack spacing={2} sx={{ pt: 2 }}>
              <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }} >

                  <RHFDatePicker label="Event Date*" name="date" />
                  <RHFAutocomplete
                    label="Start Time*"
                    name="start"
                    options={time_list}
                    isOptionEqualToValue={(option, value) => option?.value===value?.value}
                    getOptionLabel={(option) => `${option?.label || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.label || ''}`}</li> )}
                  />
                  <RHFDatePicker label="End Date*" name="end_date" />
                  <RHFAutocomplete
                    // disabled={allDay}
                    label="End Time*"
                    name="end"
                    options={time_list}
                    isOptionEqualToValue={(option, value) => option?.value===value?.value}
                    getOptionLabel={(option) => `${option?.label || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.label || ''}`}</li> )}
                  />
                  {/* <Button sx={{height:'58px'}} variant={allDay?'contained':'outlined'} onClick={()=> handleAllDayChange(!allDay)} 
                  startIcon={<Iconify icon={allDay?'gravity-ui:circle-check':'gravity-ui:circle'}/>}>All Day</Button> */}
                </Box>
                
                <RHFTextField
                  name={isPersonalMode ? 'title' : 'jiraTicket'}
                  label={isPersonalMode ? 'Title' : 'Jira Ticket'}
                />

                {!isPersonalMode && (
                  <>
                    <RHFAutocomplete
                      label="Customer*"
                      name="customer"
                      options={activeCustomers}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                    />
                    {/* <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} > */}
                    <RHFAutocomplete
                      multiple
                      disableCloseOnSelect
                      filterSelectedOptions
                      label="Machines"
                      name="machines"
                      options={activeCustomerMachines}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option?.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`}</li> )}
                    />
                    <RHFAutocomplete
                      label="Site"
                      name="site"
                      options={activeSites}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                    />
                    {/* </Box> */}
                    <RHFAutocomplete
                      label="Primary Technician*"
                      name="primaryTechnician"
                      options={activeSpContacts}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
                    />
                    <RHFAutocomplete
                      multiple
                      disableCloseOnSelect
                      filterSelectedOptions
                      label="Supporting Technicians"
                      name="supportingTechnicians"
                      options={activeSpContacts}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
                    />
                    <RHFAutocomplete
                      multiple
                      disableCloseOnSelect
                      filterSelectedOptions
                      label="Notify Contacts"
                      name="notifyContacts"
                      options={activeSpContacts}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                      renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
                    />
                  </>
                )}

                <RHFTextField name="description" label="Description" multiline rows={3} />
                {selectedEvent && (
                   <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} >
                   <Typography variant='body2' color='#919EAB' ><b>created by:</b> {`${defaultValues?.createdByFullName || ''}`} <br /> {`${fDateTime(defaultValues.createdAt)} / ${defaultValues.createdIP}`}</Typography>
                   <Typography variant='body2' color='#919EAB' ><b>updated by:</b> {`${defaultValues?.updatedByFullName || ''}`} <br /> {`${fDateTime(defaultValues.updatedAt)} / ${defaultValues.updatedIP}`}</Typography>
                  </Box>
                )}
              </Stack>
            </Grid>
          </FormProvider>
        </DialogContent>
        <DialogActions>
        {selectedEvent && (
          <IconTooltip color='#FF0000' title='Delete Event' icon='eva:trash-2-outline' onClick={()=> setOpenConfirm(true)}/>
        )}
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="outlined" color="inherit" onClick={handleCloseModel}>Cancel</Button>
          <LoadingButton type="submit" variant="contained" onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
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
            onClick={()=> {
              onDeleteEvent()
              setOpenConfirm(false);
            } }
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
}

export default EventDialog;
                   
