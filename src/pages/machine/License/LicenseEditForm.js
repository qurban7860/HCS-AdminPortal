import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { Box, Card, Grid, Autocomplete, TextField } from '@mui/material';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { useSnackbar } from '../../../components/snackbar';
import { 
  setLicenseEditFormVisibility, 
  updateLicense,
  LicenseTypes,
  setLicenseViewFormVisibility,
  getLicense
} from '../../../redux/slices/products/license';
import { LicenseSchema } from './schemas/LicenseSchema';
import FormProvider, { RHFSwitch, RHFTextField, RHFDatePicker } from '../../../components/hook-form';
import { Snacks } from '../../../constants/machine-constants';

// ----------------------------------------------------------------------

export default function LicenseEditForm() {
  
  const {
    license, 
  } = useSelector((state) => state.license);
  const { machine } = useSelector((state) => state.machine);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const defaultValues = useMemo(
    () => ({
      licenseKey: license?.licenseKey ||'',
      version:license?.licenseDetail?.version ||'',
      type:license?.licenseDetail?.type||null,
      deviceGUID:license?.licenseDetail?.deviceGUID ||'',
      deviceName:license?.licenseDetail?.deviceName ||'',
      production:license?.licenseDetail?.production ||'',
      waste:license?.licenseDetail?.waste ||'',
      extensionTime:license?.licenseDetail?.extensionTime ||'',
      requestTime:license?.licenseDetail?.requestTime ||'',
      isActive: license?.isActive || false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(LicenseSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  
  const handleTypeChange = (event, newValue) => {
    setValue('type', newValue);
  };

  const toggleCancel = async() => {
    dispatch(setLicenseEditFormVisibility (false));
    dispatch(setLicenseViewFormVisibility(true));
  };

  const onSubmit = async (data) => {
      try {
        dispatch(await updateLicense(machine._id, license._id, data));
        reset();
        enqueueSnackbar(Snacks.licenseUpdated);
        dispatch(setLicenseViewFormVisibility(true));
        dispatch(getLicense(machine._id, license._id));
      } catch (err) {
        enqueueSnackbar(Snacks.failedUpdateLicense, { variant: 'error' });
        console.error(err.message);
      }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} mb={5}>
      <Grid
        container
        spacing={4}>
        <Grid item xs={18} md={12}>
        <Card sx={{ p: 3 }}>
            <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)',}}>
              <RHFTextField name="deviceGUID" label="Device GUID" disabled/>
              <RHFTextField name="deviceName" label="Device Name" disabled/>
              <Autocomplete disablePortal id="combo-box-demo" name="type"
                defaultValue={defaultValues?.type}
                options={LicenseTypes} onChange={handleTypeChange}
                renderInput={(params) => <TextField {...params} label="Type" />}
              />
              <RHFTextField name="version" label="Version"/>
            </Box>
            <Box sx={{marginTop:2}} rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)',}}>
                <RHFTextField name='licenseKey' label='License Key' minRows={5} multiline/>
            </Box>
            <Box sx={{marginTop:2}} rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)',}}>
              <RHFTextField name="production" label="Production"/>
              <RHFTextField name="waste" label="Waste"/>
              <RHFDatePicker inputFormat='dd/MM/yyyy' name="extensionTime" label="Extension Time" />
              <RHFDatePicker inputFormat='dd/MM/yyyy' name="requestTime" label="Request Time" />
              <RHFSwitch name="isActive" label="Active" />
            </Box>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
