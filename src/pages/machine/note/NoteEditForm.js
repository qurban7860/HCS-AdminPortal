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
import {  updateNote ,setNoteEditFormVisibility} from '../../../redux/slices/products/machineNote';

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

  const { note, isLoading, error, initial, responseMessage ,noteEditFormVisibility, formVisibility} = useSelector((state) => state.machinenote);
  
  const dispatch = useDispatch();
  
  const { machine } = useSelector((state) => state.machine);

  const { enqueueSnackbar } = useSnackbar();

  const EditNoteSchema = Yup.object().shape({
    note: Yup.string().max(10000).required("Note Field is required!"),
  });

  const defaultValues = useMemo(
    () => ({
      note: note?.note || '',
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
    try {
      await dispatch(updateNote(machine._id,note._id,data));
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
              </Stack>
              {/* <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
              </Box> */}

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
