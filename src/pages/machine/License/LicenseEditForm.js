import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo , useState, useLayoutEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link ,Autocomplete, TextField} from '@mui/material';
// global
import { CONFIG } from '../../../config-global';
// slice
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';

import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch
} from '../../../components/hook-form';
import { setLicenseEditFormVisibility, setLicenseFormVisibility , updateLicense , saveLicense , getLicenses , getLicense, deleteLicense } from '../../../redux/slices/products/license';


// ----------------------------------------------------------------------

export default function LicenseEditForm() {
  
  const { initial,error, responseMessage , licenseEditFormVisibility ,licenses, license, formVisibility } = useSelector((state) => state.license);
  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const EditLicenseSchema = Yup.object().shape({
    licenseKey: Yup.string().max(100).required('License key is required!'),
    licenseDetail: Yup.string().max(10000).required('License detail is required!'),
    isDisabled : Yup.boolean(),

  });

  const defaultValues = useMemo(
    () => ({
      licenseKey: license?.licenseKey ||'',
      licenseDetail: license?.licenseDetail || '',
      isDisabled : license?.isDisabled ,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(EditLicenseSchema),
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

  // useEffect(() => {
  //   if (site) {
  //     reset(defaultValues);
  //   }
  // }, [site, reset, defaultValues]);

  const toggleCancel = () => 
  {
    dispatch(setLicenseEditFormVisibility (false));
  };

  const onSubmit = async (data) => {
    console.log("Setting update Data : ",data);
    try {
      await dispatch(updateLicense( machine._id,license._id,data));
      reset();
    } catch (err) {
      enqueueSnackbar('Saving failed!');
      console.error(error);
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
                Edit License 
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
                <RHFTextField name="licenseKey" label="License Key" multiline/>
                <RHFTextField name="licenseDetail" label="License Detail" minRows={8} multiline />
                <RHFSwitch
                name="isDisabled"
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
                  Save Changes
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
