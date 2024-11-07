// import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { Box, Card, Grid, Stack, Container } from '@mui/material';
// slice
import { addMachineStatus } from '../../../redux/slices/products/statuses';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';

// util
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function ServiceReportStatusAddForm() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const serviceReportStatusSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name is required!'),
    description: Yup.string().max(5000),
    isActive: Yup.boolean(),
    isDefault: Yup.boolean(),
    displayOrderNo: Yup.number()
      .typeError('Display Order No. must be a number')
      .nullable()
      .transform((_, val) => (val !== '' ? Number(val) : null)),
    slug: Yup.string().min(0).max(50).matches(/^(?!.*\s)[\S\s]{0,50}$/, 'Slug field cannot contain blankspaces'),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      isActive: true,
      isDefault: false,
      createdAt: '',
      displayOrderNo: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(serviceReportStatusSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await dispatch(addMachineStatus(data));
      reset();
      enqueueSnackbar('Service Report Status created successfully!');
      navigate(PATH_MACHINE.machines.machineSettings.status.root);
    } catch (error) {
      enqueueSnackbar(error?.message || "Service Report Status create failed!", { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => navigate(PATH_MACHINE.machines.machineSettings.status.root);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="New Service Report Status" icon="material-symbols:diversity-1-rounded" />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12} sx={{ mt: 3 }}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
                >
                  <RHFTextField name="name" label="Name*"/>
                  <RHFTextField name="description" label="Description" minRows={7} multiline />
                  <RHFTextField name="displayOrderNo" label="Display Order No." />
                  <RHFTextField name="slug" label="Slug" />

                <Grid display="flex">
                  <RHFSwitch name="isActive" label="Active" />
                  <RHFSwitch name="isDefault" label="Default" />
                </Grid>
                </Box>
              </Stack>
              <AddFormButtons machineSettingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
