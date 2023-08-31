import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Box, Stack, Typography, Container, FormControl, RadioGroup, Radio, FormControlLabel, FormLabel, FormGroup, Switch, FormHelperText} from '@mui/material';
// hooks
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../../../components/snackbar';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
import FormHeading from '../../components/DocumentForms/FormHeading';
// schema
import { MachineTechParamsSchema } from '../../schemas/machine';
// slice
import { addMachineServiceParam } from '../../../redux/slices/products/machineServiceParams';
// components
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../components/Defaults/Cover';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
// styles
import { StyledCardContainer } from '../../../theme/styles/default-styles';
// constants
import { FORMLABELS } from '../../../constants/default-constants';
import { Snacks } from '../../../constants/machine-constants';

// ----------------------------------------------------------------------

export default function MachineServiceParamAddForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      name:             '',
      printName:        '',
      description:      '',
      helpHint:         '',
      linkToUserManual: '',
      isRequired:       false, 
      inputType:        '',
      unitType:         '',    
      minValidation:    '',
      maxValidation:    '',
      isActive:         true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    try {
      await dispatch(addMachineServiceParam(data));
      reset();
      enqueueSnackbar(Snacks.machineServiceParamAdd);
      navigate(PATH_MACHINE.machines.settings.machineServiceParams.list);
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.machineServiceParams.list);
  };
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={FORMLABELS.COVER.MACHINE_SERVICE_PARAMS}
          setting
          backLink={PATH_MACHINE.machines.settings.machineServiceParams.list}
        />
      </StyledCardContainer>
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

                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
