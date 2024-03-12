import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Container, Box, Card, Grid, Stack, Typography } from '@mui/material';
import { updateNote, setNoteEditFormVisibility, getNote, resetNote } from '../../../redux/slices/customer/customerNote';
import { getActiveSites, resetActiveSites } from '../../../redux/slices/customer/site';
import { getActiveContacts, resetActiveContacts } from '../../../redux/slices/customer/contact';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../components/hook-form';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { NoteSchema } from '../../schemas/customer'
import CustomerTabContainer from '../util/CustomerTabContainer'
import { PATH_CUSTOMER } from '../../../routes/paths';


// ----------------------------------------------------------------------

export default function NoteEditForm() {
  const { note } = useSelector((state) => state.customerNote);
  const { activeSites } = useSelector((state) => state.site);
  const { activeContacts } = useSelector((state) => state.contact);
  const { customer } = useSelector((state) => state.customer);
  const { customerId, id } = useParams() 
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getActiveSites(customerId))
    dispatch(getActiveContacts(customerId))
    if(id && customerId ){
      dispatch(getNote(customerId, id))
    }
    return () => {
      dispatch(resetActiveSites());
      dispatch(resetActiveContacts());
      dispatch(resetNote());
    };
  },[ dispatch, customerId, id ])

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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  
  const onSubmit = async (data) => {
    try {
      await dispatch(updateNote(customerId, id, data));
      enqueueSnackbar('Note Updated Successfully');
      await reset();
      if(customerId && id ) await navigate(PATH_CUSTOMER.notes.view(customerId, id))
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };
  
  const toggleCancel = () => { if(customerId && id ) navigate(PATH_CUSTOMER.notes.view(customerId, id))};

  return (
    <Container maxWidth={false} >
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={18} md={12}>
        <CustomerTabContainer currentTabValue='notes' />
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
                  renderOption={(props, option) => (<li {...props} key={option?._id}>{option?.name || ''}</li>)}
                />

                <RHFAutocomplete
                  name='contact'
                  label="Contact"
                  options={activeContacts}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id }
                  getOptionLabel={(option) => `${option.firstName || '' } ${option.lastName || '' }`}
                  renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.firstName || '' } ${option.lastName || '' }`}</li> )}
                />
              </Box>

              <RHFTextField name="note" label="Note*" minRows={8} multiline />
            </Stack>
            <RHFSwitch  name="isActive" label="Active" />

            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
    </Container>
  );
}
