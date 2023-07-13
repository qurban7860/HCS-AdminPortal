import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
// slice
import { setLicenseFormVisibility } from '../../../redux/slices/products/license';
// schema
import { AddLicenseSchema } from './schemas/AddLicenseSchema';
// components
import { useSnackbar } from '../../../components/snackbar';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import Iconify from '../../../components/iconify/Iconify';
// assets
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
// constants
import { Snacks } from '../../../constants/machine-constants';
import { FORMLABELS, TITLES } from '../../../constants/default-constants';

// ----------------------------------------------------------------------

export default function LicenseAddForm() {
  const [underDevelopment, setUnderDevelopment] = useState(true);
  // const {
  //   initial,
  //   error,
  //   responseMessage,
  //   licenseEditFormVisibility,
  //   licenses,
  //   license,
  //   formVisibility,
  // } = useSelector((state) => state.license);
  const { machine } = useSelector((state) => state.machine);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const toggleCancel = () => {
    dispatch(setLicenseFormVisibility(false));
  };

  const defaultValues = useMemo(
    () => ({
      licenseKey: '',
      licenseDetail: '',
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddLicenseSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      console.log('licenseDetail : ', data);
      // await dispatch(saveLicense(machine._id,data));
      enqueueSnackbar(Snacks.licenseAdded);
      reset();
    } catch (err) {
      enqueueSnackbar(Snacks.failedAddLicense, { variant: `error` });
      console.error(err.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} mb={5}>
      {underDevelopment && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h1"
            sx={{
              color: 'text.secondary',
              position: 'absolute',
              top: 200,
              left: 500,
              zIndex: 9,
            }}
          >
            <Iconify icon="mdi:alert-outline" width="30px" />
            {TITLES.UNDERDEVELOPMENT}
          </Typography>
        </Box>
      )}
      <Grid
        container
        spacing={4}
        sx={{
          opacity: underDevelopment ? 0.3 : 1,
        }}
      >
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="h2" sx={{ color: 'text.secondary' }}>
                {TITLES.NEWLICENSE}
              </Typography>
            </Stack>
            <Box
              rowGap={3}
              columnGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField
                name={FORMLABELS.LICENSE_KEY.name}
                label={FORMLABELS.LICENSE_KEY.label}
                minRows={8}
                multiline
                disabled={underDevelopment}
              />
              <RHFTextField
                name={FORMLABELS.LICENSE_DETAILS.name}
                label={FORMLABELS.LICENSE_DETAILS.label}
                minRows={8}
                multiline
                disabled={underDevelopment}
              />
              <ToggleButtons isMachine name={FORMLABELS.isACTIVE.name} disabled />
            </Box>
            <AddFormButtons
              isSubmitting={!underDevelopment && isSubmitting}
              toggleCancel={toggleCancel}
              disabled={underDevelopment}
            />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
