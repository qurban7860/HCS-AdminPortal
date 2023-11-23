import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography, Container } from '@mui/material';
// slice
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { addServiceRecordConfig } from '../../../redux/slices/products/serviceRecordConfig';
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
  const { id } = useParams();
  const { serviceRecordConfig } = useSelector((state) => state.serviceRecordConfig);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCategories } = useSelector((state) => state.category);
  const { activeServiceCategories } = useSelector((state) => state.serviceCategory);
  const [checkParams, setCheckParams] = useState([]);
  const [checkItemList, setCheckItemList] = useState([]);
  const [isDraft, setDraft] = useState(false);
  const initialState = useSelector((state) => state.serviceRecordConfig);
  const recordTypes = initialState.recordTypes;

  useEffect(() => {
    dispatch(getActiveCategories())
    dispatch(getActiveServiceCategories());
  }, [dispatch]);

  useEffect(() => {
    if(id){
      setCheckParams(serviceRecordConfig?.checkItemLists || [])
    }
  }, [serviceRecordConfig, id]);

  const defaultValues = useMemo(
    () => ({
      docTitle: id ? serviceRecordConfig?.docTitle : '',
      recordType: id ? {name: serviceRecordConfig?.recordType} || null : null,
      docVersionNo: id ? typeof serviceRecordConfig?.docVersionNo === 'number' && serviceRecordConfig.docVersionNo + 1   : 1,
      noOfApprovalsRequired: id ? serviceRecordConfig?.noOfVerificationsRequired || 1 : 1,
      machineCategory: id ? serviceRecordConfig?.machineCategory || null : null,
      machineModel:  id ? serviceRecordConfig?.machineModel || null : null,
      textBeforeCheckItems:  id ? serviceRecordConfig?.textBeforeCheckItems || '' : '',
      ListTitle: '',
      checkItemCategory: null,

      textAfterCheckItems:  id ? serviceRecordConfig?.textAfterCheckItems || '' : '',
      isOperatorSignatureRequired:  id ? serviceRecordConfig?.isOperatorSignatureRequired : false,
      enableNote:  id ? serviceRecordConfig?.enableNote : false,
      enableMaintenanceRecommendations:  id ? serviceRecordConfig?.enableMaintenanceRecommendations : false,
      enableSuggestedSpares:  id ? serviceRecordConfig?.enableSuggestedSpares : false,

      // header
      headerType:  id ? { name: serviceRecordConfig?.header?.type } : null,
      headerLeftText:  id ? serviceRecordConfig?.header?.leftText || '' : '',
      headerCenterText:  id ? serviceRecordConfig?.header?.centerText || '' : '',
      headerRightText:  id ? serviceRecordConfig?.header?.rightText || '' : '',

      // footer
      footerType:  id ? { name: serviceRecordConfig?.footer?.type } : null,
      footerLeftText:  id ? serviceRecordConfig?.footer?.leftText || '' : '',
      footerCenterText:  id ? serviceRecordConfig?.footer?.centerText || '' : '',
      footerRightText:  id ? serviceRecordConfig?.footer?.rightText || '' : '',

      isActive: id ? serviceRecordConfig?.isActive : true,
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

  const { machineCategory, machineModel, ListTitle, checkItemCategory } = watch();

  useEffect(() => {
    if(machineCategory === null){
      dispatch(resetActiveMachineModels())
      setValue('machineModel',null);
    }else if(machineCategory?._id === machineModel?.category?._id){
      dispatch(getActiveMachineModels(machineCategory?._id));
    }else if(machineCategory?._id !== machineModel?.category?._id){
      dispatch(getActiveMachineModels(machineCategory?._id));
      // setValue('machineModel',null);
    }
  },[dispatch, machineCategory,setValue,machineModel]);

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
      if(id){
        data.parentConfig = id
        data.originalConfiguration = serviceRecordConfig?.originalConfiguration ? serviceRecordConfig?.originalConfiguration : id
      }
      data.checkItemLists = checkParams
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
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />

                  <RHFTextField name="docVersionNo" disabled label="Version No.*" />
                  <RHFTextField name="noOfApprovalsRequired" label="Required Approvals*" />

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
                    name="machineCategory"
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
                      <CheckItemTable setCheckParams={setCheckParams} checkParams={checkParams} checkItemList={checkItemList} setCheckItemList={setCheckItemList} ListTitle={ListTitle} setValue={setValue} checkItemCategory={checkItemCategory} />
                  <RHFTextField name="textAfterCheckItems" label="Text After Check Items" minRows={3} multiline />
                
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
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

                <AddFormButtons saveAsDraft={() => setDraft(true)} isDisabled={checkItemList.length > 0} isDraft={isDraft} saveButtonName='submit' isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
    </Container>
  </FormProvider>
  );
}
