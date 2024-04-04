import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Container, Card, Grid, Stack } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// 
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
// slice
import { addNote } from '../../../redux/slices/products/machineNote';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

NoteAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentNote: PropTypes.object,
};
export default function NoteAddForm({ isEdit, readOnly, currentNote }) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { machineId } = useParams();
  const navigate = useNavigate();

  const AddNoteSchema = Yup.object().shape({
    note: Yup.string().max(10000).required('Note Field is required!'),
    isActive: Yup.boolean(),
  });
  const defaultValues = useMemo(
    () => ({
      note: '',
      isActive: true,
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    try {
      await dispatch(addNote(machineId, data));
      reset();
      enqueueSnackbar('Note Added Successfully!');
      await navigate(PATH_MACHINE.machines.notes.root( machineId ))
    } catch (error) {
      enqueueSnackbar('Note Save failed!', { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => navigate(PATH_MACHINE.machines.notes.root( machineId ));

  return (
    <Container maxWidth={false} >
    <MachineTabContainer currentTabValue='notes' />
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <RHFTextField name="note" label="Note*" minRows={8} multiline />
              <RHFSwitch name="isActive" label="Active"/>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
    </Container>
  );
}
