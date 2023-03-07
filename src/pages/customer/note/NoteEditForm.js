import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';


// global
import { CONFIG } from '../../../config-global';
// slice
import { getNotes, deleteNote, getNote , updateNote ,setNoteEditFormVisibility} from '../../../redux/slices/note';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';

import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFTextField,
  

} from '../../../components/hook-form';



// ----------------------------------------------------------------------


export default function NoteEditForm() {

  const { error, note } = useSelector((state) => state.note);

  const { users } = useSelector((state) => state.user);

  const { sites } = useSelector((state) => state.site);

  const { contacts } = useSelector((state) => state.contact);

  const { customer } = useSelector((state) => state.customer);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const EditNoteSchema = Yup.object().shape({
    note: Yup.string(),
    user: Yup.string(),
    customer: Yup.string(),
    editSite: Yup.string(),
    editContact: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      id: note?._id || '',
      note: note?.note || '',
      user: note?.user || '',
      customer: note?.customer || '',
      editSite:  note?.site === null || note?.site === undefined ? null : note.site._id,
      editContact:   note?.contact === null || note?.contact === undefined  ? null : note.contact._id,
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
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (note) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  const toggleCancel = () => 
  {
    dispatch(setNoteEditFormVisibility(false));
  };

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      await dispatch(updateNote(customer._id,data));
      reset();
    dispatch(setNoteEditFormVisibility(false));
      // navigate(PATH_DASHBOARD.note.list);
    } catch (err) {
      enqueueSnackbar('Saving failed!');
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3} sx={{mb:3}}>
              <Stack spacing={1}>
                <Typography variant="h3" sx={{ color: 'text.secondary' }}>
                Edit Note
                </Typography>

                {/* <RHFEditor simple name="note" /> */}

              </Stack>

              {/* <RHFSelect native name="user" label="User">
                    <option value="" selected/>
                    { 
                    users.length > 0 && users.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect> */}

              {/* <RHFSelect native name="customer" label="Customer">
                    <option value="" selected/>
                    { 
                    customers.length > 0 && customers.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
              </RHFSelect> */}
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >

              <RHFSelect native name="editSite" label="Site">
                    <option defaultValue value="null" selected >No Site Selected</option>
                    { 
                    sites.length > 0 && sites.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
              </RHFSelect>

              <RHFSelect native name="editContact" label="Contact">
                    <option defaultValue value="null" selected >No Contact Selected</option>
                    { 
                    contacts.length > 0 && contacts.map((option) => (
                    <option key={option._id} value={option._id} >
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>
              </Box>

              <RHFTextField name="note" label="Note*" minRows={8} multiline />


              {/* <RHFSwitch
              name="isArchived"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    isArchived
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            /> */}
            </Stack>  
              {/* <Stack alignItems="flex-start" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
            </Stack> */}

            
            <Box
                rowGap={5}
                columnGap={4}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(4, 1fr)',
                }}
              > 

              <LoadingButton 
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}>
                  Save Changes
              </LoadingButton>

              <Button 
                onClick={toggleCancel}
                variant="outlined" 
                size="large">
                  Cancel
              </Button>

            </Box>
            
          </Card>
          
        </Grid>
      </Grid>
    </FormProvider>
  );
}
