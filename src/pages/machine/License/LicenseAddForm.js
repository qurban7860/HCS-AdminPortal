import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, Stack, Typography, Autocomplete, TextField } from '@mui/material';
// slice
import { setLicenseEditFormVisibility, setLicenseFormVisibility , updateLicense , saveLicense , getLicenses , getLicense, deleteLicense } from '../../../redux/slices/products/license';
// components
import { useSnackbar } from '../../../components/snackbar';
// assets


import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function LicenseAddForm() {
  
  const { initial,error, responseMessage , licenseEditFormVisibility ,licenses, license, formVisibility } = useSelector((state) => state.license);
  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const AddLicenseSchema = Yup.object().shape({
    licenseKey: Yup.string().max(1000).required('License key is required!') ,
    licenseDetail: Yup.string().max(10000).required('License detail is required!'),
    isActive : Yup.boolean(),
  });

  const toggleCancel = () => 
  {
    dispatch(setLicenseFormVisibility(false));
  };

  const defaultValues = useMemo(
    () => ({
      licenseKey: '',
      licenseDetail: '',
      isActive : true,

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

  const onChange = (event) => {
    const value = event.target.value;
  };

  const onSubmit = async (data) => {
    try {
      console.log('licenseDetail : ',data);
      // await dispatch(saveLicense(machine._id,data));
      reset();
    } catch (err) {
      enqueueSnackbar('Saving failed!');
      console.error(err);
    }
  };



  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
            <Stack spacing={1}>
                <Typography variant="h3" sx={{ color: 'text.secondary' }}>
                Create a new License
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
                <RHFTextField name="licenseKey" label="License Key" minRows={8} multiline/>
                <RHFTextField name="licenseDetail" label="License Detail" minRows={8} multiline />
                <RHFSwitch
                name="isActive"
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}>
                      Active
                    </Typography>
                  </>
                } 
              />
              </Box>
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
                  Add License
              </LoadingButton>
              <Button 
                onClick={toggleCancel}
                variant="outlined" 
                size="large">
                  Cancel
              </Button>
            </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

