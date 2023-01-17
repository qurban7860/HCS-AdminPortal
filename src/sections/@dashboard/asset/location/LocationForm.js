import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../../components/iconify';
import FormProvider, { RHFTextField, RHFSelect, RHFSwitch } from '../../../../components/hook-form';
// ----------------------------------------------------------------------
import { countries } from '../../../../assets/data';



const getInitialValues = (event) => {
  const initialEvent = {
    name: '',
    city: '',
    country: '#1890FF',
  };

  if (event) {
    return merge({}, initialEvent, event);
  }

  return initialEvent;
};

// ----------------------------------------------------------------------

LocationForm.propTypes = {
  event: PropTypes.object,
  onCancel: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onCreateUpdateEvent: PropTypes.func,
};

export default function LocationForm({
  event,
  onCreateUpdateEvent,
  onDeleteEvent,
  onCancel,
}) {
  const hasEventData = !!event;

  const EventSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Name is required'),
    city: Yup.string().max(5000),
    country: Yup.string().required('Country is required'),
  });

  

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(event),
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    try {
      const newEvent = {
        name: data.name,
        city: data.city,
        country: data.country,
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
      <Stack spacing={3} sx={{ px: 3 }}>
        <RHFTextField name="name" label="Name" />

        <RHFTextField name="city" label="City"/>

        <RHFSelect native name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
        </RHFSelect>
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
