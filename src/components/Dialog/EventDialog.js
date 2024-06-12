import PropTypes from 'prop-types';
import React,{ useEffect, useLayoutEffect, useState } from 'react';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions, DialogContent, Grid, Dialog, DialogTitle, Divider, MenuItem } from '@mui/material';
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

function getTimeObjectFromISOString(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const timeObject = {
      value: formattedTime,
      label: `${formattedTime} ${ampm}`
  };

  return timeObject;
}

const getInitialValues = (selectedEvent, range) => {
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
    notifyContacts: selectedEvent ? selectedEvent?.notifyContacts :  [],
    description: selectedEvent ? selectedEvent?.description :  '',
  };

  return initialEvent;
};

EventDialog.propTypes = {
  range: PropTypes.object,
  onDeleteEvent: PropTypes.func,
  onCreateUpdateEvent: PropTypes.func,
  colorOptions: PropTypes.arrayOf(PropTypes.string),
};
  
function EventDialog({
    range,
    colorOptions,
    onCreateUpdateEvent,
    onDeleteEvent,
  }) {
    
    const dispatch = useDispatch();
    const { selectedEvent, eventModel } = useSelector((state) => state.event );
    const { activeCustomers } = useSelector((state) => state.customer);
    const { activeContacts, activeSpContacts } = useSelector((state) => state.contact);
    const { activeSites } = useSelector((state) => state.site);
    const { activeCustomerMachines } = useSelector( (state) => state.machine );
    const [openConfirm, setOpenConfirm] = useState(false);
    
    const EventSchema = Yup.object().shape({
      date: Yup.date().nullable().label('Event Date').typeError('End Time should be a valid Date').required(),
      start: Yup.object().nullable().label('Start Time').required('Start Time is required'),
      end_date: Yup.date().nullable().label('Event Date').typeError('End Time should be a valid Date').required(),
      end: Yup.object().nullable().label('End Time').required('End Time is required'),
      jiraTicket: Yup.string().max(200).label('Jira Ticket'),
      customer: Yup.object().nullable().label('Customer').required(),
      machines: Yup.array().nullable().label('Machines'),
      site: Yup.object().nullable().label('Site'),
      primaryTechnician: Yup.object().nullable().label('Primary Technician').required(),
      supportingTechnicians: Yup.array().nullable().label('Supporting Technicians').required(),
      notifyContacts: Yup.array().nullable().label('Notify Contacts').required(),
      description: Yup.string().max(500).label('Description'),
    });

    const methods = useForm({
      resolver: yupResolver(EventSchema),
      defaultValues: getInitialValues(selectedEvent?.extendedProps, range)
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

    const { jiraTicket, customer, start, end,  primaryTechnician } = watch();

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
      reset(getInitialValues(selectedEvent?.extendedProps, range));
    }, [reset, range, selectedEvent]);
    
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
    } 

    const time_list = [
      { value: '00:00', label: '12:00 AM' },
      { value: '00:30', label: '12:30 AM' },
      { value: '01:00', label: '1:00 AM' },
      { value: '01:30', label: '1:30 AM' },
      { value: '02:00', label: '2:00 AM' },
      { value: '02:30', label: '2:30 AM' },
      { value: '03:00', label: '3:00 AM' },
      { value: '03:30', label: '3:30 AM' },
      { value: '04:00', label: '4:00 AM' },
      { value: '04:30', label: '4:30 AM' },
      { value: '05:00', label: '5:00 AM' },
      { value: '05:30', label: '5:30 AM' },
      { value: '06:00', label: '6:00 AM' },
      { value: '06:30', label: '6:30 AM' },
      { value: '07:00', label: '7:00 AM' },
      { value: '07:30', label: '7:30 AM' },
      { value: '08:00', label: '8:00 AM' },
      { value: '08:30', label: '8:30 AM' },
      { value: '09:00', label: '9:00 AM' },
      { value: '09:30', label: '9:30 AM' },
      { value: '10:00', label: '10:00 AM' },
      { value: '10:30', label: '10:30 AM' },
      { value: '11:00', label: '11:00 AM' },
      { value: '11:30', label: '11:30 AM' },
      { value: '12:00', label: '12:00 PM' },
      { value: '12:30', label: '12:30 PM' },
      { value: '13:00', label: '1:00 PM' },
      { value: '13:30', label: '1:30 PM' },
      { value: '14:00', label: '2:00 PM' },
      { value: '14:30', label: '2:30 PM' },
      { value: '15:00', label: '3:00 PM' },
      { value: '15:30', label: '3:30 PM' },
      { value: '16:00', label: '4:00 PM' },
      { value: '16:30', label: '4:30 PM' },
      { value: '17:00', label: '5:00 PM' },
      { value: '17:30', label: '5:30 PM' },
      { value: '18:00', label: '6:00 PM' },
      { value: '18:30', label: '6:30 PM' },
      { value: '19:00', label: '7:00 PM' },
      { value: '19:30', label: '7:30 PM' },
      { value: '20:00', label: '8:00 PM' },
      { value: '20:30', label: '8:30 PM' },
      { value: '21:00', label: '9:00 PM' },
      { value: '21:30', label: '9:30 PM' },
      { value: '22:00', label: '10:00 PM' },
      { value: '22:30', label: '10:30 PM' },
      { value: '23:00', label: '11:00 PM' },
      { value: '23:30', label: '11:30 PM' }
    ]
    
   

  return (
    <>
    <Dialog
      fullWidth
      disableEnforceFocus
      maxWidth="md"
      open={eventModel} 
      onClose={ handleCloseModel }
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle display='flex' justifyContent='space-between' variant='h3' sx={{pb:1, pt:2 }}>
        {selectedEvent ? 'Update Event' : 'New Event'}
      </DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{px:3}}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container >
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
            <RHFTextField name="jiraTicket" label="Jira Ticket" />

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
          <RHFTextField name="description" label="Description" multiline rows={3} />
        </Stack>
      </Grid>
      </FormProvider>
      </DialogContent>
      <DialogActions >
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
