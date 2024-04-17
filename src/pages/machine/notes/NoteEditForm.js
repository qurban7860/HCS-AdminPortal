import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Container, Card, Grid, Stack } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// 
import UpdateFormButtons from '../../../components/DocumentForms/UpdateFormButtons';
// Slice
import { getNote, updateNote } from '../../../redux/slices/products/machineNote';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------
export default function NoteEditForm() {
  const { note } = useSelector((state) => state.machineNote);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { machineId, id } = useParams();
  const navigate = useNavigate();

  useLayoutEffect(()=>{
    if( machineId && id ){
      dispatch(getNote( machineId, id ))
    }
  },[ dispatch, machineId, id ])

  const EditNoteSchema = Yup.object().shape({
    note: Yup.string().max(10000).required('Note Field is required!'),
    isActive: Yup.boolean(),
  });
  const defaultValues = useMemo(
    () => ({
      note: note?.note || '',
      isActive: note.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [note]
  );
  const methods = useForm({
    resolver: yupResolver(EditNoteSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (note) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  const toggleCancel = () => navigate(PATH_MACHINE.machines.notes.view(machineId, id));

  const onSubmit = async (data) => {
    try {
      await dispatch(updateNote(machineId, id, data));
      await reset();
      await enqueueSnackbar('Note Updated Successfully!');
      await navigate(PATH_MACHINE.machines.notes.view(machineId, id));
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };
  return (
    <Container maxWidth={false} >
        <MachineTabContainer currentTabValue='notes' />
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3} sx={{ mb: 3 }}>
              <RHFTextField name="note" label="Note*" minRows={8} multiline />
              <RHFSwitch name="isActive" label="Active"/>
            </Stack>
            <UpdateFormButtons toggleCancel={toggleCancel} isSubmitting={isSubmitting} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
    </Container>
  );
}
