import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Container, Box, Card, Grid, Autocomplete, TextField } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
//
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { useSnackbar } from '../../../components/snackbar';
import {  
  updateLicense,
  LicenseTypes,
  getLicense,
} from '../../../redux/slices/products/license';
import { LicenseSchema } from './schemas/LicenseSchema';
import FormProvider, { RHFSwitch, RHFTextField, RHFDatePicker } from '../../../components/hook-form';
import { Snacks } from '../../../constants/machine-constants';
import MachineTabContainer from '../util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function LicenseEditForm() {
  
  const { license } = useSelector((state) => state.license);
  const { machineId, id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(()=>{
    dispatch(getLicense(machineId, id))
  },[ dispatch, machineId, id ])

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

  const toggleCancel = () => navigate(PATH_MACHINE.machines.licenses.view(machineId, id));

  const onSubmit = async (data) => {
      try {
        await dispatch(await updateLicense(machineId, id, data));
        await reset();
        await enqueueSnackbar(Snacks.licenseUpdated);
        await navigate(PATH_MACHINE.machines.licenses.view(machineId, id))
      } catch (err) {
        enqueueSnackbar(err, { variant: 'error' });
        console.error(err);
      }
  };

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='license' />
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} mb={5}>
      <Grid
        container
        spacing={2}>
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
  </Container>
  );
}
