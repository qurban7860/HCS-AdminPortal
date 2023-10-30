import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography, Container } from '@mui/material';
// slice
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { addServiceRecordConfig, getActiveServiceRecordConfigs, resetServiceRecordConfig } from '../../../redux/slices/products/serviceRecordConfig';
import { getActiveMachineModels, resetActiveMachineModels } from '../../../redux/slices/products/model';
import { getActiveServiceCategories } from '../../../redux/slices/products/serviceCategory';
import { getActiveCategories } from '../../../redux/slices/products/category';

// schema
import { ServiceRecordConfigSchema } from '../../schemas/machine';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete} from '../../../components/hook-form';
// util
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
// constants
import { FORMLABELS } from '../../../constants/default-constants';
import CheckItemTable from './CheckItemTable';

// ----------------------------------------------------------------------

export default function ServiceRecordConfigAddForm() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { recordTypes, status, activeServiceRecordConfigs } = useSelector((state) => state.serviceRecordConfig);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCategories } = useSelector((state) => state.category);
  const { activeServiceCategories } = useSelector((state) => state.serviceCategory);
  const [checkParams, setCheckParams] = useState([]);
  const [isDraft, setDraft] = useState(false);
  
  useEffect(() => {
    dispatch(getActiveCategories())
    dispatch(getActiveServiceCategories());
  }, [dispatch]);

  const defaultValues = useMemo(
    () => ({
      docTitle: '',
      recordType: null,
      docVersionNo: 1,
      NoOfApprovalsRequired: 1,
      machineModel: null,
      category: null,
      textBeforeCheckItems: '',
      checkItemCategory: null,

      textAfterCheckItems: '',
      isOperatorSignatureRequired: false,
      enableNote: false,
      enableMaintenanceRecommendations: false,
      enableSuggestedSpares: false,

      // header
      headerType: null,
      headerLeftText: '',
      headerCenterText: '',
      headerRightText: '',

      // footer
      footerType: null,
      footerLeftText: '',
      footerCenterText: '',
      footerRightText: '',

      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(ServiceRecordConfigSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { category, machineModel, paramListTitle, checkItemCategory } = watch();

  useEffect(() => {
    if(category === null){
      dispatch(resetActiveMachineModels())
      setValue('machineModel',null);
    }else if(category?._id === machineModel?.category?._id){
      dispatch(getActiveMachineModels(category?._id));
    }else if(category?._id !== machineModel?.category?._id){
      dispatch(getActiveMachineModels(category?._id));
      setValue('machineModel',null);
    }
  },[dispatch, category,setValue,machineModel]);

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.list);
  };

  const onSubmit = async (data) => {
    try {
      if(isDraft){
        data.status = 'DRAFT'
      }else{
        data.status = 'SUBMITTED'
      }
      data.checkParam = checkParams
      await dispatch(addServiceRecordConfig(data));
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.list);
    } catch (error) {
      // enqueueSnackbar('Saving failed!');
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };


  return (
  <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_CONFIGS_ADD}
          icon="material-symbols:category-outline"
          url={PATH_MACHINE.machines.settings.serviceRecordConfigs.list}
        />
      </StyledCardContainer>
        <Grid container>
          <Grid item xs={18} md={12} >
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

                  <RHFTextField name="docTitle" label="Document Title*" />

                  <RHFAutocomplete 
                    name="recordType"
                    label="Document Type*"
                    options={recordTypes}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />

                  <RHFTextField name="docVersionNo" label="Version No.*" />
                  <RHFTextField name="NoOfApprovalsRequired" label="Required Approvals*" />

                  {/* <RHFAutocomplete 
                    name="status"
                    label="Status*"
                    options={status}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />

                  <RHFAutocomplete 
                    name="parentConfig"
                    label="Parent Configuration"
                    options={activeServiceRecordConfigs}
                    getOptionLabel={(option) => `${option?.docTitle ?? ''} ${option?.docTitle ? '-' : '' } ${option.recordType ? option.recordType :   ''}`}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    renderOption={(props, option) => (
                    <li {...props} key={option._id}>{`${option?.docTitle ?? ''} ${option?.docTitle ? '-' : '' } ${option.recordType ? option.recordType : ''}`}</li>
                    )}
                  /> */}

                  <RHFAutocomplete 
                    name="category"
                    label="Machine Category"
                    options={activeCategories}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />

                  <RHFAutocomplete 
                    name="machineModel"
                    label="Machine Model"
                    options={activeMachineModels}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />
                  
                </Box>
                  <RHFTextField name="textBeforeCheckItems" label="Text Before Check Items" minRows={3} multiline />
                      <CheckItemTable setCheckParams={setCheckParams} checkParams={checkParams} paramListTitle={paramListTitle} setValue={setValue} checkItemCategory={checkItemCategory} />
                  <RHFTextField name="textAfterCheckItems" label="Text After Check Items" minRows={3} multiline />
                
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(3, 1fr)',
                  }}
                >

                  <RHFSwitch
                    name="enableNote"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                        Enable Note
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
                  
                  <RHFSwitch
                    name="isOperatorSignatureRequired"
                    labelPlacement="start"
                    label={
                      <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary', }} >
                        Is Operator Signature Required
                      </Typography>
                    }
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
                    sm: 'repeat(3, 1fr)',
                  }}
                >

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
                    sm: 'repeat(3, 1fr)',
                  }}
                >
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

                <AddFormButtons saveAsDraft={() => setDraft(true)} isDraft={isDraft} saveButtonName='submit' isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
    </Container>
  </FormProvider>
  );
}
