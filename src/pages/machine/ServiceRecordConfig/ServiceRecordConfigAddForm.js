import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography, Container, Autocomplete, TextField } from '@mui/material';
// slice
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { addServiceRecordConfig } from '../../../redux/slices/products/serviceRecordConfig';
import { getMachineServiceParams } from '../../../redux/slices/products/machineServiceParams';
// schema
import { AddMachineSchema } from '../../schemas/document';
// routes
import { PATH_DASHBOARD, PATH_MACHINE } from '../../../routes/paths';
import { useSettingsContext } from '../../../components/settings';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFMultiSelect } from '../../../components/hook-form';
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
  const [selectedRecordType, setRecordType] = useState('');
  const [sortedMachineServiceParams, setSortedMachineSerivceParams] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { recordTypes } = useSelector((state) => state.serviceRecordConfig);
  const { machineServiceParams } = useSelector((state) => state.machineServiceParam);

  useLayoutEffect(() => {
    dispatch(getMachineServiceParams());
  }, [dispatch]);

  
  const AddMachineServiceRecordConfigSchema = Yup.object().shape({
    recordType: Yup.string(),
    machineModel: Yup.string(),
    docTitle: Yup.string(),
    textBeforeParams: Yup.string(),

    // Check Params
    paramListTitle: Yup.string(),
    paramList : Yup.array(),

    textAfterFields: Yup.string(),
    isOperatorSignatureRequired: Yup.boolean(),
    enableServiceNote: Yup.boolean(),
    enableMaintenanceRecommendations: Yup.boolean(),
    enableSuggestedSpares: Yup.boolean(),

    // header
    headerType: Yup.string(),
    headerLeftText: Yup.string(),
    headerCenterText: Yup.string(),
    headerRightText: Yup.string(),

    // footer
    footerType: Yup.string(),
    footerLeftText: Yup.string(),
    footerCenterText: Yup.string(),
    footerRightText: Yup.string(),

    isActive: Yup.boolean()
  });

  const defaultValues = useMemo(
    () => ({
      recordType: '',
      machineModel: '',
      docTitle: '',
      textBeforeParams: '',

      // Check Params
      paramListTitle: '',
      paramList : [],

      textAfterFields: '',
      isOperatorSignatureRequired: false,
      enableServiceNote: false,
      enableMaintenanceRecommendations: false,
      enableSuggestedSpares: false,

      // header
      headerType: '',
      headerLeftText: '',
      headerCenterText: '',
      headerRightText: '',

      // footer
      footerType: '',
      footerLeftText: '',
      footerCenterText: '',
      footerRightText: '',

      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  

  const methods = useForm({
    resolver: yupResolver(AddMachineServiceRecordConfigSchema),
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
    const mappedMachineServiceParams = machineServiceParams.map((serviceParam) => ({
      value: serviceParam?._id,
      label: serviceParam.name,
    }));

    const sortedMachineServiceParamsTemp = [...mappedMachineServiceParams].sort((a, b) => {
      const nameA = a.label.toUpperCase();
      const nameB = b.label.toUpperCase();
      return nameA.localeCompare(nameB);
    });
    setSortedMachineSerivceParams(sortedMachineServiceParamsTemp);
  }, [machineServiceParams]);

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.list);
  };

  const onSubmit = async (data) => {
    data.recordType = selectedRecordType;
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
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <Autocomplete
                      // {...field}
                      // id="controllable-states-demo"
                      options={recordTypes}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          console.log('newval----->', newValue);
                          setRecordType(newValue.name);
                        } else {
                          setRecordType('');
                        }
                      }}
                      renderInput={(params) => (
                        <TextField 
                        {...params} 
                        name="recordType"
                        id="recordType"
                        label="Record Type"  
                        // error={!!error}
                        // helperText={error?.message} 
                        // inputRef={ref} 
                        />
                      )}
                      ChipProps={{ size: 'small' }}
                    />
                  <RHFTextField name="machineModel" label="Machine Model" />
                  <RHFTextField name="docTitle" label="Doc Title" />
                  <RHFTextField name="textBeforeParams" label="Text Before Params" />
                </Box>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFTextField name="textAfterFields" label="Text After Fields" />
                </Box>            
                
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFSwitch
                    name="isOperatorSignatureRequired"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                        isOperatorSignatureRequired
                      </Typography>
                    }
                  />
                  <RHFSwitch
                    name="enableServiceNote"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                        enableServiceNote
                      </Typography>
                    }
                  />
                  <RHFSwitch
                    name="enableMaintenanceRecommendations"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                        enableMaintenanceRecommendations
                      </Typography>
                    }
                  />
                  <RHFSwitch
                    name="enableSuggestedSpares"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                        enableSuggestedSpares
                      </Typography>
                    }
                  /> 
                </Box>
                <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary' }}>
                  Check Params
                </Typography>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFTextField name="paramListTitle" label="Param List Title" />
                  <RHFMultiSelect
                    chip
                    checkbox
                    name="paramList"
                    label="Param List"
                    options={sortedMachineServiceParams}
                  />                
                </Box>
                <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary' }}>
                  Header
                </Typography>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  {/* <RHFTextField name="header" label="Header" /> */}
                  <RHFTextField name="headerType" label="Header Type" />
                  <RHFTextField name="headerLeftText" label="Header Left Text" />
                  <RHFTextField name="headerCenterText" label="Header Center Text" />
                  <RHFTextField name="headerRightText" label="Header Right Text" />
                </Box>
                <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary' }}>
                  Footer
                </Typography>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  {/* <RHFTextField name="footer" label="Footer" /> */}
                  <RHFTextField name="footerType" label="Footer Type" />
                  <RHFTextField name="footerLeftText" label="Footer Left Text" />
                  <RHFTextField name="footerCenterText" label="Footer Center Text" />
                  <RHFTextField name="footerRightText" label="Footer Right Text" />
                </Box>
              {/* </Stack> */}
            {/* </Card> */}
            {/* <Card sx={{ p: 3, mb: 3 }}> */}
              {/* <Stack spacing={3}> */}
                {/* <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary' }}>
                  Address Information
                </Typography>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  
                </Box> */}


                  <RHFSwitch
                    name="isActive"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                        Active
                      </Typography>
                    }
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
