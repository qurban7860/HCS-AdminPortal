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
import { onCloseModal } from '../../redux/slices/visit/visit';
import DialogLink from './DialogLink';
import Iconify from '../iconify';
import { getActiveCustomers, resetActiveCustomers } from '../../redux/slices/customer/customer';
import { getActiveSPContacts, resetActiveSPContacts } from '../../redux/slices/customer/contact';
import { getActiveCustomerMachines, resetActiveCustomerMachines } from '../../redux/slices/products/machine';
import { getActiveSites, resetActiveSites } from '../../redux/slices/customer/site';
import FormProvider, { RHFDatePicker, RHFTimePicker, RHFTextField, RHFAutocomplete, RHFSwitch } from '../hook-form';

const getInitialValues = (visit, range) => {
  
  const initialEvent = {
    visitDate: visit ? visit?.visitDate : (range?.start || new Date() ) ,
    start: visit ? visit?.start : (range?.start  || new Date(new Date().setHours(7, 0, 0)) ) ,
    end: visit ? visit?.end : null,
    allDay: visit ? visit?.allDay : false,
    customer: visit ? visit?.customer : null,
    machine: visit ? visit?.machine :  null,
    site: visit ? visit?.site :  null,
    jiraTicket: visit ? visit?.jiraTicket :  '',
    primaryTechnician: visit ? visit?.primaryTechnician :  null,
    supportingTechnicians: visit ? visit?.supportingTechnicians :  [],
    notifyContacts: visit ? visit?.notifyContacts :  [],
    // status: visit ? visit?.status :  '',
    purposeOfVisit: visit ? visit?.purposeOfVisit :  '',
  };

  return initialEvent;
};


  VisitDialog.propTypes = {
    event: PropTypes.object,
    range: PropTypes.object,
    onDeleteEvent: PropTypes.func,
    onCreateUpdateEvent: PropTypes.func,
    colorOptions: PropTypes.arrayOf(PropTypes.string),
  };
  
function VisitDialog({
    event,
    range,
    colorOptions,
    onCreateUpdateEvent,
    onDeleteEvent,
  }) {
    
    const dispatch = useDispatch();
    const { openModal } = useSelector((state) => state.visit );
    const { activeCustomers } = useSelector((state) => state.customer);
    const { activeContacts, activeSpContacts } = useSelector((state) => state.contact);
    const { activeSites } = useSelector((state) => state.site);
    const { activeCustomerMachines } = useSelector( (state) => state.machine );
    
    const hasEventData = !!event;

    useEffect(()=>{
      if(openModal){
        dispatch(getActiveCustomers())
        dispatch(getActiveSPContacts())
      }
      return () => {
        dispatch(resetActiveCustomers())
        dispatch(resetActiveSPContacts())
        dispatch(resetActiveCustomerMachines())
        dispatch(resetActiveSites())
      }
    },[ dispatch, openModal ])

    const EventSchema = Yup.object().shape({
      visitDate: Yup.date().nullable().label('Visit Date').typeError('Date should be a valid Date').required(),
      start: Yup.date().nullable().label('Start Time').typeError('Start Time should be a valid Time'),
      end: Yup.date().nullable().label('End Time').typeError('End Time should be a valid Time'),
      allDay: Yup.bool().label('All Day'),
      jiraTicket: Yup.string().max(200).label('Jira Ticket').required(),
      customer: Yup.object().nullable().label('Customer').required(),
      machine: Yup.object().nullable().label('Machine').required(),
      site: Yup.object().nullable().label('Site'),
      primaryTechnician: Yup.object().nullable().label('Primary Technician').required(),
      supportingTechnicians: Yup.array().nullable().label('Supporting Technicians').required(),
      notifyContacts: Yup.array().nullable().label('Notify Contacts').required(),
      // status: Yup.string().nullable().label('Status').required(),
      purposeOfVisit: Yup.string().max(500).label('purposeOfVisit'),
    });
  
    const methods = useForm({
      resolver: yupResolver(EventSchema),
      defaultValues: getInitialValues(event?.extendedProps, range),
    });
    
    const {
      reset,
      watch,
      setValue,
      trigger,
      control,
      handleSubmit,
      formState: { isSubmitting },
    } = methods;

    const { visitDate, jiraTicket, customer, machine, primaryTechnician, allDay } = watch();

    useEffect(() => { 
      if( jiraTicket || customer || machine || primaryTechnician ){
        trigger() 
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ visitDate, jiraTicket, customer, machine, primaryTechnician  ]);

    useEffect(() => {
      reset(getInitialValues(event?.extendedProps, range));
    }, [event, range, reset]);
    
    const onSubmit = async (data) => {
      try {
        await onCreateUpdateEvent(data);
        await reset();
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <Dialog
      fullWidth
      disableEnforceFocus
      maxWidth="md"
      open={openModal} 
      onClose={()=> dispatch(onCloseModal()) }
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle variant='h3' sx={{pb:1, pt:2 }}>{hasEventData ? 'Update Event' : 'New Event'}</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{px:3}}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container >
        <Stack spacing={2} sx={{ pt: 2 }}>
          <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }} >
            <RHFDatePicker label="Visit Date" name="visitDate" />
            {allDay ? <div /> : <RHFTimePicker label="Start" name="start" />}
            {allDay ? <div /> : <RHFTimePicker label="End" name="end" />}
            <RHFSwitch name="allDay" label="All Day" sx={{ ml: 'auto'}} />
          </Box>
            <RHFTextField name="jiraTicket" label="Jira Ticket" />

          <RHFAutocomplete 
            label="Customer"
            name="customer"
            options={activeCustomers}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            getOptionLabel={(option) => `${option.name || ''}`}
            renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
            onChange={( e ,newValue) => {  
              if(newValue){
                setValue('customer',newValue);
                  dispatch(getActiveCustomerMachines(newValue?._id))
                  dispatch(getActiveSites(newValue?._id))
              } else {
                setValue('customer',null);
                  dispatch(resetActiveCustomerMachines())
                  dispatch(resetActiveSites())
              }
            }}
          />

          <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >
          
            <RHFAutocomplete 
              label="Machine"
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
              label="Primary Technician"
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

          <RHFTextField name="purposeOfVisit" label="Purpose of Visit" multiline rows={3} />

        </Stack>
      </Grid>
      </FormProvider>
      </DialogContent>
      <DialogActions >
        {hasEventData && (
          <Tooltip title="Delete Event">
            <IconButton onClick={onDeleteEvent} >
              <Iconify icon="eva:trash-2-outline" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={()=> dispatch(onCloseModal())}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
          {hasEventData ? 'Update' : 'Add'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}


export default VisitDialog;
