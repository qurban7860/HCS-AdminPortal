import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Box, Stack, Typography, Container, FormControl, RadioGroup, Radio, FormControlLabel } from '@mui/material';
// hooks
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../../../components/snackbar';
// schema
import { MachineTechParamsSchema } from '../../schemas/machine';
// routes
import { PATH_MACHINE, PATH_SETTING } from '../../../routes/paths';
// components
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import {
  getMachineServiceParam,
  updateMachineServiceParam,
} from '../../../redux/slices/products/machineServiceParams';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import FormHeading from '../../components/DocumentForms/FormHeading';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import { Cover } from '../../components/Defaults/Cover';
// styles
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { FORMLABELS } from '../../../constants/default-constants';
import { Snacks } from '../../../constants/machine-constants';


// ----------------------------------------------------------------------

export default function DocumentCategoryeEditForm() {
  const { machineServiceParam } = useSelector((state) => state.machineServiceParam);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();


  const defaultValues = useMemo(
    () => ({
      name:             machineServiceParam?.name || '',
      printName:        machineServiceParam?.printName || '',
      description:      machineServiceParam?.description || '',
      helpHint:         machineServiceParam?.helpHint || '',
      linkToUserManual: machineServiceParam?.linkToUserManual || '',
      isRequired:       machineServiceParam?.isRequired, 
      inputType:        machineServiceParam?.inputType || '',
      unitType:         machineServiceParam?.unitType || '',    
      minValidation:    machineServiceParam?.minValidation || '',
      maxValidation:    machineServiceParam?.maxValidation || '',
      isActive:         machineServiceParam?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ machineServiceParam ]
  );

  const methods = useForm({
    resolver: yupResolver(MachineTechParamsSchema),
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

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.machineServiceParams.view(machineServiceParam._id));
  };

  const onSubmit = async (data) => {
    try {
      console.log("data : ", data);
      await dispatch(updateMachineServiceParam(machineServiceParam._id, data));
      dispatch(getMachineServiceParam(machineServiceParam._id))
      navigate(PATH_MACHINE.machines.settings.machineServiceParams.view(machineServiceParam._id));
      enqueueSnackbar(Snacks.machineServiceParamUpdate, { variant: `success` });
      reset();
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={machineServiceParam?.name}
          setting
          backLink={PATH_MACHINE.machines.settings.machineServiceParams.view(machineServiceParam?._id)}
        />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <FormHeading heading={FORMLABELS.COVER.MACHINE_SERVICE_PARAM_EDIT} />
                <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >
                  <RHFTextField name="name" label="Name" />
                  <RHFTextField name="printName" label="Print Name" />
                  <RHFTextField name="helpHint" label="Help Hint" />
                  <RHFTextField name="linkToUserManual" label="Link To User Manual" />
                  <RHFTextField name="inputType" label="Input Type" />
                  <RHFTextField name="unitType" label="Unit Type" />
                  <RHFTextField name="minValidation" label="Minimum Validation" />
                  <RHFTextField name="maxValidation" label="Maximum Validation" />
                </Box>
                  <RHFTextField name="description" label="Description" minRows={7} multiline />
                <Grid container display="flex">
                  <RHFSwitch
                    name="isRequired"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                        Required
                      </Typography>
                    }
                  />

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
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
