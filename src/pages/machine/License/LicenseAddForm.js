import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Autocomplete, Box, Card, Grid, TextField } from '@mui/material';
// slice
import { LicenseTypes, addLicense, setLicenseFormVisibility } from '../../../redux/slices/products/license';
// schema
import { LicenseSchema } from './schemas/LicenseSchema';
// components
import { useSnackbar } from '../../../components/snackbar';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
// assets
import FormProvider, { RHFDatePicker, RHFSwitch, RHFTextField } from '../../../components/hook-form';
// constants
import { Snacks } from '../../../constants/machine-constants';

// ----------------------------------------------------------------------

export default function LicenseAddForm() {

  const { machine } = useSelector((state) => state.machine);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const toggleCancel = () => {
    dispatch(setLicenseFormVisibility(false));
  };

  const defaultValues = useMemo(
    () => ({
      licenseKey: '',
      version:'',
      type:null,
      deviceGUID:machine?._id || '',
      deviceName:machine?.serialNo || '',
      production:'',
      waste:'',
      extensionTime:null,
      requestTime:null,
      isActive: true,
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

  
  // Handle Type
  const handleTypeChange = (event, newValue) => {
    setValue('type', newValue);
  };
 
  const onSubmit = async (data) => {
    try {
          await dispatch(addLicense(machine._id, data));
          reset();
          enqueueSnackbar(Snacks.licenseAdded);
          dispatch(setLicenseFormVisibility(false));
    } catch (err) {
      enqueueSnackbar(Snacks.failedAddLicense, { variant: 'error' });
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
                options={LicenseTypes} onChange={handleTypeChange}
                renderInput={(params) => <TextField {...params} label="Type" />}
              />
              <RHFTextField name="version" label="Version"/>
              </Box>
              <Box sx={{marginTop:2}}  rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)',}}>
                <RHFTextField name='licenseKey' label='License Key' minRows={5} multiline/>
            </Box>
            <Box sx={{marginTop:2}} rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)',}}>
           
              <RHFTextField name="production" label="Production"/>
              <RHFTextField name="waste" label="Waste"/>
              <RHFDatePicker inputFormat='dd/MM/yyyy' name="extensionTime" label="Extension Date" />
              <RHFDatePicker inputFormat='dd/MM/yyyy' name="requestTime" label="Request Date" />

              <RHFSwitch name="isActive"  label="Active"/>
            </Box>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
