import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, } from '@mui/material';
// slice
import { updateServiceReportStatus } from '../../../redux/slices/products/serviceReportStatuses';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../components/hook-form';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { serviceReportStatusSchema } from '../../schemas/machine';

// ----------------------------------------------------------------------

export default function ServiceReportStatusEditForm() {
  const { serviceReportStatus, statusTypes } = useSelector((state) => state.serviceReportStatuses);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const defaultValues = useMemo(
    () => ({
      name: serviceReportStatus?.name || '',
      type: serviceReportStatus?.type || '',
      displayOrderNo: serviceReportStatus?.displayOrderNo || '',
      description: serviceReportStatus?.description || '',
      isActive: serviceReportStatus?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serviceReportStatus]
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

  useEffect(() => {
    if (serviceReportStatus) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceReportStatus]);

  const toggleCancel = () => navigate(PATH_MACHINE.machineSettings.serviceReportsStatus.view(id));

  const onSubmit = async (data) => {
    try {
      await dispatch(updateServiceReportStatus(data, id));
      reset();
      enqueueSnackbar('Status Updated successfully!');
      navigate(PATH_MACHINE.machineSettings.serviceReportsStatus.view(id));
    } catch (err) {
      enqueueSnackbar('Status Update failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <StyledCardContainer>
            <Cover name="Edit Report Status" icon="fluent-mdl2:sync-status-solid" />
          </StyledCardContainer>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
              >
                <RHFTextField name="name" label="Name" />
                <RHFAutocomplete 
                  name="type" 
                  label="Type*" 
                  options={ statusTypes }
                  isOptionEqualToValue={ (option, value) => option === value }
                />
                <RHFTextField name="description" label="Description" minRows={7} multiline />
                <RHFTextField name="displayOrderNo" label="Display Order No." type="number" />

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
  );
}
