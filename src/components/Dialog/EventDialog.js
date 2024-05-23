import PropTypes from 'prop-types';
import React,{ useEffect } from 'react';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions, DialogContent, Grid, Dialog, DialogTitle, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';

// components
import { setEventModel } from '../../redux/slices/event/event';
import DialogLink from './DialogLink';
import Iconify from '../iconify';
import { getActiveSPContacts, resetActiveSPContacts } from '../../redux/slices/customer/contact';
import { getActiveCustomerMachines, resetActiveCustomerMachines } from '../../redux/slices/products/machine';
import { getActiveSites, resetActiveSites } from '../../redux/slices/customer/site';
import FormProvider, { RHFDatePicker, RHFTimePicker, RHFTextField, RHFAutocomplete, RHFSwitch } from '../hook-form';
import IconTooltip from '../Icons/IconTooltip';

const getInitialValues = (selectedEvent, range) => {
  const initialEvent = {
    _id: selectedEvent ? selectedEvent?._id : null ,
    date: selectedEvent ? selectedEvent?.start : (range?.start || new Date() ) ,
    start: selectedEvent ? selectedEvent?.start : new Date(new Date().setHours(7, 0, 0)),
    end: selectedEvent ? selectedEvent?.end : null,
    allDay: selectedEvent ? selectedEvent?.allDay : false,
    customer: selectedEvent ? selectedEvent?.customer : null,
    machine: selectedEvent ? selectedEvent?.machine :  null,
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
    
    // const hasEventData = !!event;

    useEffect(()=>{
      if(eventModel){
        dispatch(getActiveSPContacts())
      }
      return () => {
        dispatch(resetActiveSPContacts())
        dispatch(resetActiveCustomerMachines())
        dispatch(resetActiveSites())
      }
    },[ dispatch, eventModel ])

    const EventSchema = Yup.object().shape({
      start: Yup.date().nullable().label('Start Time').typeError('Start Time should be a valid Time'),
      end: Yup.date().nullable().label('End Time').typeError('End Time should be a valid Time'),
      allDay: Yup.bool().label('All Day'),
      jiraTicket: Yup.string().max(200).label('Jira Ticket'),
      customer: Yup.object().nullable().label('Customer').required(),
      machine: Yup.object().nullable().label('Machine').required(),
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
      formState: { isSubmitting, errors },
      clearErrors
    } = methods;

    const { jiraTicket, customer, machine, primaryTechnician, allDay } = watch();

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

    
    useEffect(() => {
      reset(getInitialValues(selectedEvent?.extendedProps, range));
    }, [reset, range, selectedEvent]);
    
    const onSubmit = async (data) => {
     try {
        await onCreateUpdateEvent(data);
        await reset();
      } catch (error) {
        console.error(error);
      }
    };

    const handleCloseModel = async ()=> {
      await dispatch(setEventModel(false)) 
      await dispatch(resetActiveSPContacts())
      await dispatch(resetActiveCustomerMachines())
      await dispatch(resetActiveSites())
      reset()
    } 

  return (
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
            <RHFDatePicker label="Event Date" name="date" />
            {/* {allDay ? <div /> : <RHFTimePicker label="Start" name="start" />}
            {allDay ? <div /> : <RHFTimePicker label="End" name="end" />} */}
            {/* <RHFSwitch name="allDay" label="All Day"/> */}
            <RHFTimePicker disabled={allDay} label="Start" name="start" />
            <RHFTimePicker disabled={allDay} label="End" name="end" />
            <Button variant={allDay?'contained':'outlined'} onClick={()=> setValue('allDay', !allDay)} 
            startIcon={<Iconify icon={allDay?'icon-park-solid:check-one':'icon-park-outline:check-one'}/>}>All Day</Button>
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

          <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >
          
            <RHFAutocomplete 
              label="Machine*"
              name="machine"
              options={activeCustomerMachines}
              isOptionEqualToValue={(option, value) => option?._id === value?._id}
              getOptionLabel={(option) => `${option?.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`}
              renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`}</li> )}
              onChange={( e ,newValue) => {  
                if(newValue){
                  setValue('machine',newValue);
                  if(newValue?.instalationSite){
                    setValue('site',newValue?.instalationSite)
                  }
                  clearErrors('machine');
                } else {
                  setValue('machine',null);
                }
              }}
            />     

            <RHFAutocomplete 
              label="Site"
              name="site"
              options={activeSites}
              isOptionEqualToValue={(option, value) => option?._id === value?._id}
              getOptionLabel={(option) => `${option.name || ''}`}
              renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
            />   

          </Box>
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
          <RHFTextField name="purposeOfEvent" label="Purpose of Event" multiline rows={3} />
        </Stack>
      </Grid>
      </FormProvider>
      </DialogContent>
      <DialogActions >
        {selectedEvent && (
          <IconTooltip color='#FF0000' title='Delete Event' icon='eva:trash-2-outline' onClick={onDeleteEvent}/>
        )}
        
        <Box sx={{ flexGrow: 1 }} />
          <Button variant="outlined" color="inherit" onClick={handleCloseModel}>Cancel</Button>
          <LoadingButton type="submit" variant="contained" onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
            {selectedEvent ? 'Update' : 'Add'}
          </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}


export default EventDialog;
