import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack, Typography, Container, Autocomplete, TextField } from '@mui/material';
// slice
import {
  updateServiceRecordConfig,
  setServiceRecordConfigEditFormVisibility,
  getServiceRecordConfig,
} from '../../../redux/slices/products/serviceRecordConfig';
import { getActiveMachineModels } from '../../../redux/slices/products/model';
import { getMachineServiceParams } from '../../../redux/slices/products/machineServiceParams';
import { getActiveServiceCategories } from '../../../redux/slices/products/serviceCategory';

// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFMultiSelect, RHFAutocomplete } from '../../../components/hook-form';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
// constants
import { FORMLABELS } from '../../../constants/default-constants';
// ----------------------------------------------------------------------

export default function ServiceRecordConfigEditForm() {
  const { error, serviceRecordConfig, recordTypes, headerFooterTypes } = useSelector((state) => state.serviceRecordConfig);
  const { machineServiceParams } = useSelector((state) => state.machineServiceParam);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const [sortedMachineServiceParams, setSortedMachineSerivceParams] = useState([]);
  const [selectedRecordType, setRecordType] = useState('');
  const [selectedHeaderType, setHeaderType] = useState('');
  const [selectedFooterType, setFooterType] = useState('');


  const EditServiceRecordConfigSchema = Yup.object().shape({
    recordType: Yup.object().label('Record Type').nullable(),
    machineModel: Yup.object().label('Model').nullable(),
    category: Yup.object().label('Category').nullable(),
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
    headerType: Yup.object().label('Header Type').required().nullable(),
    headerLeftText: Yup.string(),
    headerCenterText: Yup.string(),
    headerRightText: Yup.string(),

    // footer
    footerType: Yup.object().label('Footer Type').required().nullable(),
    footerLeftText: Yup.string(),
    footerCenterText: Yup.string(),
    footerRightText: Yup.string(),

    isActive: Yup.boolean()
  });

  const defaultValues = useMemo(
    () => ({
    recordType: serviceRecordConfig?.recordType || '',
    machineModel: serviceRecordConfig?.machineModel || '',
    category: serviceRecordConfig?.category || '',
    docTitle: serviceRecordConfig?.docTitle || '',
    textBeforeParams: serviceRecordConfig?.textBeforeParams || '',

    // Check Params
    paramListTitle: serviceRecordConfig?.checkParams[0]?.paramListTitle || '',
    paramList : serviceRecordConfig?.checkParams[0]?.paramList || [],

    textAfterFields: serviceRecordConfig?.textAfterFields || '',
    isOperatorSignatureRequired: serviceRecordConfig?.isOperatorSignatureRequired || false,
    enableServiceNote: serviceRecordConfig?.enableServiceNote || false,
    enableMaintenanceRecommendations: serviceRecordConfig?.enableMaintenanceRecommendations || false,
    enableSuggestedSpares: serviceRecordConfig?.enableSuggestedSpares || false,

    // header
    headerType: serviceRecordConfig?.header || '',
    headerLeftText: serviceRecordConfig?.header?.leftText || '',
    headerCenterText: serviceRecordConfig?.header?.centerText || '',
    headerRightText: serviceRecordConfig?.header?.rightText || '',

    // footer
    footerType: serviceRecordConfig?.footer || '',
    footerLeftText: serviceRecordConfig?.footer?.leftText || '',
    footerCenterText: serviceRecordConfig?.footer?.centerText || '',
    footerRightText: serviceRecordConfig?.footer?.rightText || '',

    isActive: serviceRecordConfig.isActive
  }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serviceRecordConfig]
  );

  const methods = useForm({
    resolver: yupResolver(EditServiceRecordConfigSchema),
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

  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeServiceCategories } = useSelector((state) => state.serviceCategory);


  /* eslint-disable */
  useLayoutEffect(() => {
    dispatch(getServiceRecordConfig(id));
    dispatch(getActiveMachineModels())
    dispatch(getMachineServiceParams());
    dispatch(getActiveServiceCategories());

    const selectedRecordTypeName = recordTypes.find((recordType) => recordType.name === serviceRecordConfig.recordType);
    if(selectedRecordTypeName){
      setRecordType(selectedRecordTypeName);
    }

    const selectedHeaderTypeName = headerFooterTypes.find((headerFooterType) => headerFooterType.name === serviceRecordConfig.header.type);
    if(selectedHeaderTypeName){
      setHeaderType(selectedHeaderTypeName);
    }

    const selectedFooterTypeName = headerFooterTypes.find((headerFooterType) => headerFooterType.name === serviceRecordConfig.footer.type);
    if(selectedFooterTypeName){
      setFooterType(selectedFooterTypeName);
    }
  }, [dispatch, id]);
  /* eslint-enable */

  useEffect(() => {
    if (serviceRecordConfig) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceRecordConfig]);
  
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
    dispatch(setServiceRecordConfigEditFormVisibility(false));
    navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.view(id));
  };
  const onSubmit = async (data) => {
    try {
      // console.log(data);
      data.recordType = selectedRecordType.name;
      await dispatch(updateServiceRecordConfig(data, id));
      reset();
      dispatch(setServiceRecordConfigEditFormVisibility(false));
      enqueueSnackbar('Update success!');
      navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.view(id));
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name="Edit Service Record Config"
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
                    options={recordTypes}
                    value={selectedRecordType}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                    onChange={(event, newValue) => {
                      if (newValue) {
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
                      
                      />
                    )}
                    ChipProps={{ size: 'small' }}
                  />
                  <RHFAutocomplete 
                    name="category"
                    label="Category"
                    options={activeServiceCategories}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />
                  <RHFAutocomplete 
                    name="machineModel"
                    label="Model"
                    options={activeMachineModels}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />
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
                        Is Operator Signature Required
                      </Typography>
                    }
                  />
                  <RHFSwitch
                    name="enableServiceNote"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                        Enable Service Note
                      </Typography>
                    }
                  />
                  <RHFSwitch
                    name="enableMaintenanceRecommendations"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                        Enable Maintenance Recommendations
                      </Typography>
                    }
                  />
                  <RHFSwitch
                    name="enableSuggestedSpares"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                        Enable Suggested Spares
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
                  <RHFAutocomplete 
                    name="headerType" label="Header Type"
                    options={headerFooterTypes}
                    value={selectedHeaderType}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />
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
                  <RHFAutocomplete 
                    name="footerType" 
                    label="Footer Type"
                    options={headerFooterTypes}
                    value={selectedFooterType}

                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />
                  <RHFTextField name="footerLeftText" label="Footer Left Text" />
                  <RHFTextField name="footerCenterText" label="Footer Center Text" />
                  <RHFTextField name="footerRightText" label="Footer Right Text" />
                </Box>

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
