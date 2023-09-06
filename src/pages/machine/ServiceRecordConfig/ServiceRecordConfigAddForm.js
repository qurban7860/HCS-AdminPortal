import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


import { useNavigate } from 'react-router-dom';
// form
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Autocomplete, Box, Card, Grid, Stack, Typography, Container, TextField } from '@mui/material';
// slice
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { addServiceRecordConfig, recordType} from '../../../redux/slices/products/serviceRecordConfig';
// schema
import { AddMachineSchema } from '../../schemas/document';
// routes
import { PATH_DASHBOARD, PATH_MACHINE } from '../../../routes/paths';
import { useSettingsContext } from '../../../components/settings';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// asset
import { countries } from '../../../assets/data';
// util
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
// constants
import { FORMLABELS } from '../../../constants/default-constants';
import { Snacks, FORMLABELS as formLABELS } from '../../../constants/document-constants';



// ----------------------------------------------------------------------

export default function ServiceRecordConfigAddForm() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { activeMachineModels } = useSelector((state) => state.machinemodel);

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      isActive: true,
      connections: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddMachineSchema),
    defaultValues
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.list);
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(addServiceRecordConfig(data));
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.list);
      // console.log(PATH_MACHINE.supplier.list)
    } catch (error) {
      // enqueueSnackbar('Saving failed!');
      enqueueSnackbar(error?.message, { variant: `error` });
      console.error(error);
    }
  };

  // Handle Type
  const handleTypeChange = (event, newValue) => {
    setValue('recordType', newValue);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name="New Machine Service Record Config"
          icon="material-symbols:category-outline"
          url={PATH_MACHINE.machines.settings.serviceRecordConfigs.list}
        />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12} sx={{ mt: 3 }}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                  }}
                >
                  
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    name="recordType"
                    options={recordType}
                    onChange={handleTypeChange}
                    renderInput={(params) => <TextField {...params} label="Record Type" />}
                  />

                  <Controller
                    name="model"
                    control={control}
                    defaultValue={null}
                    render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        id="controllable-states-demo"
                        options={activeMachineModels}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                        )}
                        onChange={(event, value) => field.onChange(value)}
                        renderInput={(params) => (
                          <TextField 
                          {...params} 
                          name="model"
                          id="model"
                          label="Model"  
                          error={!!error}
                          helperText={error?.message} 
                          inputRef={ref} 
                          />
                        )}
                        ChipProps={{ size: 'small' }}
                      />
                    )}
                  />


                    <RHFTextField name="docTitle" label="Document Title" />
                    <RHFTextField name="textBeforeParams" label="Text Before Params" />



                    <RHFTextField name="textAfterFields" label="Text After Fields" />
                    

                    <RHFSwitch
                      name="isOperatorSignatureRequired"
                      labelPlacement="start"
                      label={
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mx: 0,
                            width: 1,
                            justifyContent: 'space-between',
                            mb: 0.5,
                            color: 'text.secondary',
                          }}
                        >
                          {' '}
                          Is Operator Signature Required
                        </Typography>
                      }
                    />

                    <RHFSwitch
                      name="enableServiceNote"
                      labelPlacement="start"
                      label={
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mx: 0,
                            width: 1,
                            justifyContent: 'space-between',
                            mb: 0.5,
                            color: 'text.secondary',
                          }}
                        >
                          {' '}
                          Enable Service Note
                        </Typography>
                      }
                    />

                    <RHFSwitch
                      name="enableMaintenanceRecommendations"
                      labelPlacement="start"
                      label={
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mx: 0,
                            width: 1,
                            justifyContent: 'space-between',
                            mb: 0.5,
                            color: 'text.secondary',
                          }}
                        >
                          {' '}
                          Enable Maintenance Recommendations
                        </Typography>
                      }
                    />

                    <RHFSwitch
                      name="enableSuggestedSpares"
                      labelPlacement="start"
                      label={
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mx: 0,
                            width: 1,
                            justifyContent: 'space-between',
                            mb: 0.5,
                            color: 'text.secondary',
                          }}
                        >
                          {' '}
                          Enable Suggested Spares
                        </Typography>
                      }
                    />

				  
			
                </Box>

                <ToggleButtons
                  isMachine
                  isCONNECTABLE
                  name={FORMLABELS.isACTIVE.name}
                  CONNECTName={FORMLABELS.isCONNECTABLE.name}
                />

                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
