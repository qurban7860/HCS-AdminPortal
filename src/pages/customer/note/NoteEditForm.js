import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { updateNote, setNoteEditFormVisibility } from '../../../redux/slices/customer/customerNote';
import { getActiveSites } from '../../../redux/slices/customer/site';
import { getActiveContacts } from '../../../redux/slices/customer/contact';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../components/hook-form';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { NoteSchema } from '../../schemas/customer'

// ----------------------------------------------------------------------

export default function NoteEditForm() {
  const { note } = useSelector((state) => state.customerNote);
  const { activeSites } = useSelector((state) => state.site);
  const { activeContacts } = useSelector((state) => state.contact);
  const { customer } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(()=>{
    dispatch(getActiveSites(customer?._id))
    dispatch(getActiveContacts(customer?._id))
  },[ dispatch, customer?._id ])

  const defaultValues = useMemo(
    () => ({
      id: note?._id || '',
      site: note?.site || null,
      contact: note?.contact || null,
      note: note?.note || '',
      isActive: note?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [note]
  );

  const methods = useForm({
    resolver: yupResolver(NoteSchema),
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
                <RHFAutocomplete
                  name="site"
                  label="Site"
                  options={activeSites}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.name || ''}`}
                  renderOption={(props, option) => (<li {...props} key={option._id}>{option?.name || ''}</li>)}
                />

                <RHFAutocomplete
                  name='contact'
                  label="Contact"
                  options={activeContacts}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id }
                  getOptionLabel={(option) => `${option.firstName || '' } ${option.lastName || '' }`}
                  renderOption={(props, option) => ( <li {...props} key={option._id}>{`${option.firstName || '' } ${option.lastName || '' }`}</li> )}
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
