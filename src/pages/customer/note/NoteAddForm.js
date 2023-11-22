import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
// import { LoadingButton } from '@mui/lab';
import { Box,Card, Grid, Stack, Typography, TextField, Autocomplete } from '@mui/material';
// slice
import { addNote, setNoteFormVisibility } from '../../../redux/slices/customer/customerNote';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField } from '../../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
// ----------------------------------------------------------------------

export default function NoteAddForm() {
  // const { users } = useSelector((state) => state.user);

  const { activeSites } = useSelector((state) => state.site);
  const { activeContacts } = useSelector((state) => state.contact);
  const { customer } = useSelector((state) => state.customer);
  const [siteVal, setSiteVal] = useState('');
  const [contactVal, setContactVal] = useState('');
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const AddNoteSchema = Yup.object().shape({
    note: Yup.string().max(2000).required('Note Field is required!'),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      note: '',
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddNoteSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    if (siteVal) {
      data.site = siteVal;
    }
    if (contactVal) {
      data.contact = contactVal;
    }
    try {
      await dispatch(addNote(customer._id, data));
      enqueueSnackbar('Note Created Successfully!');
      reset();
    } catch (error) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    dispatch(setNoteFormVisibility(false));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h3" sx={{ color: 'text.secondary' }}>
                  Create a New Note
                </Typography>
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
                  options={activeSites}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
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
                  isOptionEqualToValue={(option, value) => option?._id === value?._id }
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

              <Box
                rowGap={5}
                columnGap={4}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(4, 1fr)',
                }}
              >
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
                      {' '}
                      Active
                    </Typography>
                  }
                />
              </Box>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
