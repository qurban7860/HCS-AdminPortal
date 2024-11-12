import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { Box, Card, Grid, Stack, Container } from '@mui/material';
// slice
import { addServiceReportStatus } from '../../../redux/slices/products/serviceReportStatuses';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../components/hook-form';
// util
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { serviceReportStatusSchema } from '../../schemas/machine';


// ----------------------------------------------------------------------

export default function ServiceReportStatusAddForm() {
  const dispatch = useDispatch();
  const { statusTypes } = useSelector( ( state ) => state.serviceReportStatuses );

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      name: '',
      type: null,
      displayOrderNo: '',
      description: '',
      isActive: true,
      isDefault: false,
      isSubmit: false,
      createdAt: '',
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
      await dispatch(addServiceReportStatus(data));
      reset();
      enqueueSnackbar('Service Report Status created successfully!');
      navigate(PATH_MACHINE.machines.machineSettings.serviceReportsStatus.root);
    } catch (error) {
      enqueueSnackbar(typeof error === 'string' && error || "Service Report Status create failed!", { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => navigate(PATH_MACHINE.machines.machineSettings.serviceReportsStatus.root);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="New Report Status" icon="material-symbols:diversity-1-rounded" />
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
                  <RHFAutocomplete 
                    name="type" 
                    label="Type*" 
                    options={statusTypes}
                    isOptionEqualToValue={ (option, value) => option === value }
                  />
                  <RHFTextField name="displayOrderNo" label="Display Order No." />
                  <RHFTextField name="description" label="Description" minRows={7} multiline />

                <Grid display="flex">
                  <RHFSwitch name="isActive" label="Active" />
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
