import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Typography, Card, Grid, Stack } from '@mui/material';
import UpdateFormButtons from '../../components/DocumentForms/UpdateFormButtons';
// Slice
import { updateNote, setNoteEditFormVisibility } from '../../../redux/slices/products/machineNote';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import FormHeading from '../../components/DocumentForms/FormHeading';

// ----------------------------------------------------------------------
export default function NoteEditForm() {
  const { note, error } = useSelector((state) => state.machinenote);
  const dispatch = useDispatch();
  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();
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
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
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
      await dispatch(updateNote(machine._id, note._id, data));
      reset();
      dispatch(setNoteEditFormVisibility(false));
      // navigate(PATH_DASHBOARD.note.list);
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
              <FormHeading heading="Edit Note" />
              <RHFTextField name="note" label="Note*" minRows={8} multiline />
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
            </Stack>
            <UpdateFormButtons toggleCancel={toggleCancel} isSubmitting={isSubmitting} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
