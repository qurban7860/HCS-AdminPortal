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
import FormProvider, { RHFDateTimePicker, RHFTextField, RHFAutocomplete, RHFSwitch } from '../hook-form';

const getInitialValues = (visit, range) => {
  console.log("visit : ",visit)
  const initialEvent = {
    visitDate: visit ? visit?.visitDate : new Date().toISOString(),
    customer: visit ? visit?.customer : null,
    machine: visit ? visit?.machine :  null,
    site: visit ? visit?.site :  null,
    jiraTicket: visit ? visit?.jiraTicket :  '',
    primaryTechnician: visit ? visit?.primaryTechnician :  null,
    supportingTechnicians: visit ? visit?.t :  [],
    notifyContacts: visit ? visit?.notifyContacts :  [],
    // status: visit ? visit?.status :  '',
    purposeOfVisit: visit ? visit?.purposeOfVisit :  '',
  };

  // if (visit || range) {
  //   return merge({}, initialEvent, visit );
  // }

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
console.log("event : ",event)
    const dispatch = useDispatch();

    const { openModal } = useSelector((state) => state.visit );
    const { activeCustomers } = useSelector((state) => state.customer);
    const { activeContacts, activeSpContacts } = useSelector((state) => state.contact);
    const { activeSites } = useSelector((state) => state.site);
    const { activeCustomerMachines } = useSelector( (state) => state.machine );
    
    const hasEventData = !!event;

    useEffect(()=>{
      dispatch(getActiveCustomers())
      dispatch(getActiveSPContacts())
      return () => {
        dispatch(resetActiveCustomers())
        dispatch(resetActiveSPContacts())
        dispatch(resetActiveCustomerMachines())
        dispatch(resetActiveSites())
      }
    },[ dispatch ])

    const EventSchema = Yup.object().shape({
      visitDate: Yup.date().nullable().label('Visit Date').typeError('Date should be a valid Date').required(),
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
      control,
      handleSubmit,
      formState: { isSubmitting },
    } = methods;
  
    useEffect(() => {
      reset(getInitialValues(event?.extendedProps, range));
    }, [event, range, reset]);
    
    const onSubmit = async (data) => {
      try {
        onCreateUpdateEvent(data);
        dispatch(onCloseModal());
        reset();
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
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle variant='h3' sx={{pb:1, pt:2}}>{hasEventData ? 'Update Visit' : 'New Visit'}</DialogTitle>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{px:3}}>
        <Stack spacing={2} sx={{ p: 2 }}>
          <Box rowGap={2} columnGap={2} display="flex" >
            <RHFDateTimePicker label="Visit Date" name="visitDate" />
            <RHFSwitch name="allDay" label="All Day" />
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

      </DialogContent>
      <DialogActions>
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

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {hasEventData ? 'Update' : 'Add'}
        </LoadingButton>
      </DialogActions>
      </FormProvider>
    </Dialog>
  );
}


export default VisitDialog;
