import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link, Container } from '@mui/material';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
// global
import { CONFIG } from '../../../config-global';
// slice
import { updateMachineServiceRecord, setAllFlagsFalse } from '../../../redux/slices/products/machineServiceRecord';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';
import FormHeading from '../../components/DocumentForms/FormHeading';
import { FORMLABELS } from '../../../constants/default-constants';
import { MachineServiceRecordSchema } from '../../schemas/machine';
import FormProvider, {
  RHFSwitch,
  RHFTextField,

} from '../../../components/hook-form';

import { countries } from '../../../assets/data';

// ----------------------------------------------------------------------

export default function MachineServiceRecordEditForm() {

  const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      recordType:                 machineServiceRecord?.recordType || null,
      serviceRecordConfig:        machineServiceRecord?.serviceRecordConfig || null,
      serviceDate:                machineServiceRecord?.serviceDate || null,
      customer:                   machineServiceRecord?.customer || null, 
      site:                       machineServiceRecord?.site || null,
      machine:                    machineServiceRecord?.machine || null,
      decoiler:                   machineServiceRecord?.decoiler || null,
      technician:                 machineServiceRecord?.technician || null,
      // checkParams:     
      serviceNote:                machineServiceRecord?.serviceNote || '',
      maintenanceRecommendation:  machineServiceRecord?.maintenanceRecommendation || '',
      suggestedSpares:            machineServiceRecord?.suggestedSpares || '',
      // files: machineServiceRecord?.files || [],
      operator:                   machineServiceRecord?.operator || null,
      operatorRemarks:            machineServiceRecord?.operatorRemarks || '',
      isActive:                   machineServiceRecord?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [machineServiceRecord, machine]
  );

  const methods = useForm({
    resolver: yupResolver(MachineServiceRecordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (machineServiceRecord) {
      reset(defaultValues);
    }
  }, [machineServiceRecord, reset, defaultValues]);

  const toggleCancel = () => 
  {
    dispatch(setAllFlagsFalse());
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateMachineServiceRecord(machineServiceRecord?._id,data));
      reset();
      dispatch(setAllFlagsFalse());
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };


  return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <FormHeading heading={FORMLABELS.COVER.MACHINE_SERVICE_PARAM_ADD} />
                <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >
                  <RHFTextField name="name" label="Name" />
                </Box>
                  <RHFTextField name="description" label="Description" minRows={7} multiline />
                <Grid container display="flex">
                  <RHFSwitch
                    name="isActive"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                        Active
                      </Typography>
                    }
                  />
                </Grid>
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
  );
}
