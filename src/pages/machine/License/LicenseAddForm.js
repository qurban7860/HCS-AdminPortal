import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Autocomplete, Box, Card, Grid, TextField } from '@mui/material';
// slice
import { DatePicker } from '@mui/x-date-pickers';
import { LicenseTypes, addLicense, setLicenseFormVisibility } from '../../../redux/slices/products/license';
// schema
import { LicenseSchema } from './schemas/LicenseSchema';
// components
import { useSnackbar } from '../../../components/snackbar';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
// assets
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
// constants
import { Snacks } from '../../../constants/machine-constants';
import { FORMLABELS} from '../../../constants/default-constants';

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
      type:'',
      deviceName:'',
      deviceGUID:'',
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
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const [extensionTime, setExtensionTime] = useState(null); // State to store the selected date
  const [extensionTimeError, setExtensionTimeError] = useState(''); // State to manage the error message

  const [requestTime, setRequestTime] = useState(null); // State to store the selected date
  const [requestTimeError, setRequestTimeError] = useState(''); // State to manage the error message

  // Function to handle date change
  const handleExtensionTimeChange = newValue => {
    setValue('extensionTime',newValue)
    setExtensionTime(newValue);
    setExtensionTimeError(''); // Clear the error when a date is selected
  };

  // Function to handle date change
  const handleRequestTimeChange = newValue => {
    setRequestTime(newValue);
    setValue('requestTime',newValue)
    setRequestTimeError(''); // Clear the error when a date is selected
  };


  // Handle Type
  const handleTypeChange = (event, newValue) => {
    setValue('type', newValue);
  };
 
  const onSubmit = async (data) => {

    if (!extensionTime) {
      setExtensionTimeError('Extension Time is required');
    }else if (!requestTime) {
      setRequestTimeError('Request Time is required');
    }else {
      try {
        dispatch(addLicense(machine._id, data));
        enqueueSnackbar(Snacks.licenseAdded);
        reset();
      } catch (err) {
        enqueueSnackbar(Snacks.failedAddLicense, { variant: 'error' });
        console.error(err.message);
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} mb={5}>
      <Grid
        container
        spacing={4}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                  <RHFTextField name='licenseKey' label='License Key' inputProps={{ maxLength: 50 }}/>
                  <RHFTextField name="version" label="Version" inputProps={{ maxLength: 20 }}/>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    name="type"
                    options={LicenseTypes}
                    onChange={handleTypeChange}
                    renderInput={(params) => <TextField {...params} label="Type" />}
                  />
                  <RHFTextField name="deviceName" label="Device Name" inputProps={{ maxLength: 50 }}/>
                  <RHFTextField name="deviceGUID" label="Device GUID" inputProps={{ maxLength: 50 }}/>
                  <RHFTextField type="number" name="production" label="Production" inputProps={{ maxLength: 20 }}/>
                  <RHFTextField type="number" name="waste" label="Waste" inputProps={{ maxLength: 20 }}/>

                  <DatePicker
                    label="Extension Time"
                    name="extensionTime"
                    value={extensionTime}
                    onChange={handleExtensionTimeChange}
                    renderInput={params => <TextField {...params} error={!!extensionTimeError} helperText={extensionTimeError} />}
                  />

                  <DatePicker
                    label="Request Time"
                    name="requestTime"
                    value={requestTime}
                    onChange={handleRequestTimeChange}
                    renderInput={params => <TextField {...params} error={!!requestTimeError} helperText={requestTimeError} />}
                  />

                  {/* <DatePicker
                    label="Extension Time"
                    name='extensionTime'
                    value={extensionTime}
                    onChange={(newValue) => setValue('extensionTime',newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  /> */}

                  {/* <DatePicker
                    label="Request Time"
                    name='requestTime'
                    value={requestTime}
                    onChange={(newValue) => setValue('requestTime',newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  /> */}
                  <ToggleButtons isMachine name={FORMLABELS.isACTIVE.name} />
              
              </Box>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
