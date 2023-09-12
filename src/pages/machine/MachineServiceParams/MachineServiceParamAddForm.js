import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Box, Stack, Typography, Container } from '@mui/material';
// hooks
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../../../components/snackbar';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
import FormHeading from '../../components/DocumentForms/FormHeading';
import { FORMLABELS } from '../../../constants/default-constants';
// schema
import { MachineServiceParamsSchema } from '../../schemas/machine';
// slice
import { addMachineServiceParam } from '../../../redux/slices/products/machineServiceParams';
import { getActiveServiceCategories } from '../../../redux/slices/products/serviceCategory';
// components
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../components/Defaults/Cover';
// styles
import { StyledCardContainer } from '../../../theme/styles/default-styles';
// constants
import { Snacks } from '../../../constants/machine-constants';

// ----------------------------------------------------------------------

export default function MachineServiceParamAddForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { inputTypes, unitTypes } = useSelector((state) => state.machineServiceParam);
  const { activeServiceCategories } = useSelector((state) => state.serviceCategory);

  useEffect(()=>{
    dispatch(getActiveServiceCategories())
  },[dispatch])
  const defaultValues = useMemo(
    () => ({
      name:             '',
      serviceCategory: null,
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
    resolver: yupResolver(MachineServiceParamsSchema),
    defaultValues,
  });

  const {
    reset,
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
          name={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_PARAM_ADD}
          setting
          backLink={PATH_MACHINE.machines.settings.machineServiceParams.list}
        />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item md={12}>
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
                    <RHFAutocomplete 
                      name="serviceCategory"
                      label="Item Category"
                      options={activeServiceCategories}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
                    />
                    <RHFTextField name="printName" label="Print Name" />
                  </Box>

                  <RHFTextField name="helpHint" label="Help Hint" />
                  <RHFTextField name="linkToUserManual" label="Link To User Manual" />

                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >

                    <RHFAutocomplete 
                      name="inputType" label="Input Type"
                      options={inputTypes}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
                    />

                    <RHFAutocomplete 
                      name="unitType" label="Unit Type"
                      options={unitTypes}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
                    />

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
