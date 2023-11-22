import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
// import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography,TextField, Autocomplete } from '@mui/material';

// global
// import { CONFIG } from '../../../config-global';
// slice
import {
  updateNote,
  setNoteEditFormVisibility,
} from '../../../redux/slices/customer/customerNote';

// routes
// import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// import Iconify from '../../../components/iconify';

import FormProvider, {
  // RHFSelect,
  // RHFEditor,
  RHFTextField,
  RHFSwitch,
} from '../../../components/hook-form';

import AddFormButtons from '../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function NoteEditForm() {
  const { note } = useSelector((state) => state.customerNote);
  const { sites } = useSelector((state) => state.site);
  const { activeContacts } = useSelector((state) => state.contact);
  const { customer } = useSelector((state) => state.customer);
  const [siteVal, setSiteVal] = useState('');
  const [contactVal, setContactVal] = useState('');
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (note?.site) {
      setSiteVal(note?.site);
    }
    if (note?.contact) {
      setContactVal(note?.contact);
    }
  }, [note]);

  const EditNoteSchema = Yup.object().shape({
    note: Yup.string().max(2000).required('Note is required!'),
    user: Yup.string(),
    customer: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      id: note?._id || '',
      note: note?.note || '',
      isActive: note?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [note]
  );
  // console.log(defaultValues)

  const methods = useForm({
    resolver: yupResolver(EditNoteSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  watch();

  useEffect(() => {
    if (note) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  const toggleCancel = () => {
    dispatch(setNoteEditFormVisibility(false));
  };

  const onSubmit = async (data) => {
    if (siteVal) {
      data.site = siteVal;
    } else {
      data.site = null;
    }
    if (contactVal) {
      data.contact = contactVal;
    } else {
      data.contact = null;
    }
    try {
      await dispatch(updateNote(customer._id, note._id, data));
      enqueueSnackbar('Note Updated Successfully');
      reset();
      dispatch(setNoteEditFormVisibility(false));
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3} sx={{ mb: 3 }}>
              <Stack spacing={1}>
                <Typography variant="h3" sx={{ color: 'text.secondary' }}>Edit Note</Typography>
              </Stack>

              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <Autocomplete
                  // freeSolo
                  value={siteVal || null}
                  options={sites}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setSiteVal(newValue);
                    } else {
                      setSiteVal('');
                    }
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option._id}>
                      {option.name ? option.name : ''}
                    </li>
                  )}
                  id="controllable-states-demo"
                  renderInput={(params) => <TextField {...params} label="Site" />}
                  ChipProps={{ size: 'small' }}
                />
                <Autocomplete
                  // freeSolo
                  value={contactVal || null}
                  options={activeContacts}
                  isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                  getOptionLabel={(option) =>
                    `${option.firstName ? option.firstName : ''} ${
                      option.lastName ? option.lastName : ''
                    }`
                  }
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setContactVal(newValue);
                    } else {
                      setContactVal('');
                    }
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option._id}>
                      {option.firstName ? option.firstName : ''}{' '}
                      {option.lastName ? option.lastName : ''}
                    </li>
                  )}
                  id="controllable-states-demo"
                  renderInput={(params) => <TextField {...params} label="Contact" />}
                  ChipProps={{ size: 'small' }}
                />
              </Box>

              <RHFTextField name="note" label="Note*" minRows={8} multiline />
            </Stack>
            <RHFSwitch
              name="isActive"
              labelPlacement="start"
              label={
                <Typography
                  variant="subtitle2"
                  sx={{
                    mx: 0,
                    width: 1,
                    justifyContent: 'space-between',
                    mb: 0.5,
                    color: 'text.secondary',
                  }}
                >
                  Active
                </Typography>
              }
            />

            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
