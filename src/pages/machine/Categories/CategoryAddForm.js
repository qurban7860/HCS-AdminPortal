import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography, Container } from '@mui/material';
// slice
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { addCategory } from '../../../redux/slices/products/category';
// routes
import { PATH_DASHBOARD, PATH_MACHINE } from '../../../routes/paths';
import { useSettingsContext } from '../../../components/settings';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// asset
import { countries } from '../../../assets/data';
// util
import { Cover } from '../../components/Defaults/Cover';

// ----------------------------------------------------------------------

export default function CategoryAddForm() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const AddMachineSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name is required'),
    description: Yup.string().max(2000),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddMachineSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.categories.list);
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(addCategory(data));
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_MACHINE.machines.settings.categories.list);
      // console.log(PATH_MACHINE.supplier.list)
    } catch (error) {
      // enqueueSnackbar('Saving failed!');
      enqueueSnackbar(error?.message, { variant: `error` });
      console.error(error);
    }
  };

  const { themeStretch } = useSettingsContext();
  return (
    <>
      <Container maxWidth={false}>
        <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
          <Cover
            name="New Category"
            icon="material-symbols:category-outline"
            url={PATH_MACHINE.machines.settings.categories.list}
          />
        </Card>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container>
            <Grid item xs={18} md={12} sx={{ mt: 3 }}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                      sm: 'repeat(1, 1fr)',
                    }}
                  >
                    <RHFTextField name="name" label="Name" />
                    <RHFTextField name="description" label="Description" minRows={7} multiline />
                    <RHFSwitch
                      name="isActive"
                      labelPlacement="start"
                      label={
                        <>
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
                        </>
                      }
                    />
                  </Box>
                  <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </>
  );
}
