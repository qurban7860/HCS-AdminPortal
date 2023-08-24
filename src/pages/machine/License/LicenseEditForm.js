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
import { Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link ,Autocomplete, TextField, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
// global
// import { CONFIG } from '../../../config-global';
// slice
// routes
// import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { DatePicker } from '@mui/x-date-pickers';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { useSnackbar } from '../../../components/snackbar';

import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch
} from '../../../components/hook-form';
import { 
  setLicenseEditFormVisibility, 
  setLicenseFormVisibility , 
  updateLicense , 
  getLicenses , 
  getLicense, 
  deleteLicense, 
  LicenseTypes
} from '../../../redux/slices/products/license';
import { LicenseSchema } from './schemas/LicenseSchema';
import { Snacks } from '../../../constants/machine-constants';
import { FORMLABELS} from '../../../constants/default-constants';

// ----------------------------------------------------------------------

export default function LicenseEditForm() {
  
  const { 
    initial, 
    error, 
    responseMessage , 
    licenseEditFormVisibility ,
    licenses, 
    license, 
    formVisibility 
  } = useSelector((state) => state.license);

  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      licenseKey: license?.licenseKey ||'',
      version:license?.licenseDetail?.version ||'',
      type:license?.licenseDetail?.type||'',
      deviceName:license?.licenseDetail?.deviceName ||'',
      deviceGUID:license?.licenseDetail?.deviceGUID ||'',
      production:license?.licenseDetail?.production ||'',
      waste:license?.licenseDetail?.waste ||'',
      extensionTime:license?.licenseDetail?.extensionTime ||'',
      requestTime:license?.licenseDetail?.requestTime ||'',
      isActive: license?.isActive ||'',
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

  const [extensionTime, setExtensionTime] = useState(license?.licenseDetail?.extensionTime); // State to store the selected date
  const [extensionTimeError, setExtensionTimeError] = useState(''); // State to manage the error message

  const [requestTime, setRequestTime] = useState(license?.licenseDetail?.requestTime); // State to store the selected date
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
  
  const handleTypeChange = (event, newValue) => {
    setValue('type', newValue);
  };

  const toggleCancel = () => {
    dispatch(setLicenseEditFormVisibility (false));
  };

  const onSubmit = async (data) => {

    if (!extensionTime) {
      setExtensionTimeError('Extension Time is required');
    }else if (!requestTime) {
      setRequestTimeError('Request Time is required');
    }else {
      try {
        dispatch(updateLicense( machine._id,license._id,data));
        enqueueSnackbar(Snacks.licenseUpdated);
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
                    defaultValue={license?.licenseDetail?.type}
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

                  <ToggleButtons isMachine name={FORMLABELS.isACTIVE.name} />
              
              </Box>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
