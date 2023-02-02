import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// slice
import { getUsers } from '../../redux/slices/user';
import { getSites } from '../../redux/slices/site';
import { getContacts } from '../../redux/slices/contact';
import { getCustomers } from '../../redux/slices/customer';
import { saveNote } from '../../redux/slices/note';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';

import { useAuthContext } from '../../auth/useAuthContext';

import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFSwitch
} from '../../components/hook-form';

// ----------------------------------------------------------------------

NoteAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentNote: PropTypes.object,
};

export default function NoteAddForm({ isEdit, readOnly, currentNote }) {

  const { users } = useSelector((state) => state.user);

  const { sites } = useSelector((state) => state.site);

  const { contacts } = useSelector((state) => state.contact);

  const { customers } = useSelector((state) => state.customer);

  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

 // a note can be archived. An archived 

  const AddNoteSchema = Yup.object().shape({
    note: Yup.string(),
    user: Yup.string(),
    customer: Yup.string(),
    site: Yup.string(),
    contact: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      note: '',
      user: '',
      customer: '',
      site: '',
      contact: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentNote]
  );

  const methods = useForm({
    resolver: yupResolver(AddNoteSchema),
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

  useLayoutEffect(() => {
    dispatch(getUsers());
    dispatch(getSites());
    dispatch(getContacts());

  }, [dispatch]);

  useEffect(() => {
      reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);


  const onSubmit = async (data) => {
    console.log(data);
      try{
        await dispatch(saveNote(data));
        reset();
        navigate(PATH_DASHBOARD.note.list);
      } catch(error){
        enqueueSnackbar('Saving failed!');
        console.error(error);
      }
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={7} md={7}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Notes
                </Typography>

                <RHFEditor simple name="note" />
              </Stack>

              <RHFSelect native name="user" label="User">
                    <option value="" selected/>
                    { 
                    users.length > 0 && users.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

              <RHFSelect native name="customer" label="Customer">
                    <option value="" selected/>
                    { 
                    customers.length > 0 && customers.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
              </RHFSelect>

              <RHFSelect native name="site" label="Site">
                    <option value="" selected/>
                    { 
                    sites.length > 0 && sites.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
              </RHFSelect>

              <RHFSelect native name="contact" label="Contact">
                    <option value="" selected/>
                    { 
                    contacts.length > 0 && contacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

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

              <Stack alignItems="flex-start" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                Save Note
            </LoadingButton>
            </Stack>
            
          </Card>
          
        </Grid>
      </Grid>
    </FormProvider>
  );
}
