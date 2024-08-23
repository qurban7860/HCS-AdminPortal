import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { useSelector } from 'react-redux';
import { Box, Stack, Button, Tooltip, IconButton, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFDateTimePicker, RHFTextField, RHFAutocomplete } from '../../components/hook-form';

// ----------------------------------------------------------------------

const getInitialValues = (event, range) => {
  const initialEvent = {
    visitDate: new Date().toISOString(),
    customer: null,
    priority: '',
    machine: null,
    site: null,
    jiraTicket: '',
    primaryTechnician: null,
    supportingTechnicians: [],
    notifyContacts: [],
    files: [],
    // status: '',
    purposeOfVisit: '',
  };

  if (event || range) {
    return merge({}, initialEvent, event);
  }

  return initialEvent;
};

// ----------------------------------------------------------------------

CalendarForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onCreateUpdateEvent: PropTypes.func,
  colorOptions: PropTypes.arrayOf(PropTypes.string),
};

export default function CalendarForm({
  event,
  range,
  colorOptions,
  onCreateUpdateEvent,
  onDeleteEvent,
  onCancel,
}) {
  const { activeCustomers } = useSelector((state) => state.customer);
  const { activeContacts, activeSpContacts } = useSelector((state) => state.contact);
  const { activeSites } = useSelector((state) => state.site);
  const { activeMachines } = useSelector( (state) => state.machine );
  
  const hasEventData = !!event;

  const EventSchema = Yup.object().shape({
    visitDate: Yup.date().label('Visit Date').required(),
    jiraTicket: Yup.string().max(200).label('Jira Ticket').required(),
    customer: Yup.object().nullable().label('Customer').required(),
    priority: Yup.string().label('Priority').required(), 
    machine: Yup.object().nullable().label('Machine').required(),
    site: Yup.object().nullable().label('Site'),
    primaryTechnician: Yup.object().nullable().label('Primary Technician').required(),
    supportingTechnicians: Yup.array().nullable().label('Supporting Technicians').required(),
    notifyContacts: Yup.array().nullable().label('Notify Contacts').required(),
    // status: Yup.string().nullable().label('Status').required(),
    purposeOfVisit: Yup.string().max(500).label('purposeOfVisit'),
    files: Yup.array().of(Yup.mixed()).nullable().label('Files'), 
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(event, range),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const newEvent = {
        title: data.title,
        description: data.description,
        textColor: data.textColor,
        allDay: data.allDay,
        start: data.start,
        end: data.end,
      };
      onCreateUpdateEvent(newEvent);
      onCancel();
      reset();
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ p: 2 }}>
        <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >
          <RHFDateTimePicker label="Visit Date" name="visitDate" />
          <RHFTextField name="jiraTicket" label="Jira Ticket" />
        </Box>
        <RHFAutocomplete 
          label="Customer"
          name="customer"
          options={activeCustomers}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => `${option.name || ''}`}
          renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
        />
        <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >

        <RHFAutocomplete 
          label="Machine"
          name="machine"
          options={activeMachines}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => `${option.name || ''}`}
          renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
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
      <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >
        <RHFAutocomplete 
          label="Primary Technician"
          name="primaryTechnician"
          options={activeSpContacts}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
          renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
        />   

      </Box>
        <RHFAutocomplete 
          multiple
          label="Supporting Technicians"
          name="supportingTechnicians"
          options={activeSpContacts}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
          renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
        />   
        <RHFAutocomplete 
          multiple
          label="Notify Contacts"
          name="notifyContacts"
          options={activeSpContacts}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
          renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
        />        

        <RHFTextField name="purposeOfVisit" label="Purpose of Visit" multiline rows={3} />

      </Stack>
      <DialogActions>
        {hasEventData && (
          <Tooltip title="Delete Event">
            <IconButton onClick={onDeleteEvent}>
              <Iconify icon="eva:trash-2-outline" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {hasEventData ? 'Update' : 'Add'}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
