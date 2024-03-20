import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
// slice
import {
  updateServiceRecordConfig,
  setServiceRecordConfigEditFormVisibility,
  getServiceRecordConfig,
} from '../../../../redux/slices/products/serviceRecordConfig';
import { getActiveMachineModels, resetActiveMachineModels } from '../../../../redux/slices/products/model';
import { getActiveServiceCategories } from '../../../../redux/slices/products/serviceCategory';
import { getActiveCategories } from '../../../../redux/slices/products/category';
import { ServiceRecordConfigSchema } from '../../../schemas/machine';
// routes
import { PATH_MACHINE } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../../components/hook-form';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { FORMLABELS } from '../../../../constants/default-constants';
import CheckItemTable from './CheckItemTable';
import { recordTypes } from '../../util/index'

// ----------------------------------------------------------------------

export default function ServiceRecordConfigEditForm() {
  const { serviceRecordConfig } = useSelector((state) => state.serviceRecordConfig);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCategories } = useSelector((state) => state.category);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const [checkParams, setCheckParams] = useState([]);
  const [checkItemList, setCheckItemList] = useState([]);

  const [isDraft, setDraft] = useState(false);

  const defaultValues = useMemo(
    () => ({
    docTitle: serviceRecordConfig?.docTitle || '',
    recordType: {name: serviceRecordConfig?.recordType} || null,
    machineCategory: serviceRecordConfig?.machineCategory || null,
    machineModel: serviceRecordConfig?.machineModel || null,
    docVersionNo: serviceRecordConfig?.docVersionNo || 1,
    noOfApprovalsRequired: serviceRecordConfig?.noOfApprovalsRequired || 1,
    textBeforeCheckItems: serviceRecordConfig?.textBeforeCheckItems || '',
    checkItemCategory: null,
    // // Check Params
    ListTitle:  '',
    // paramList : serviceRecordConfig?.checkParams[0]?.paramList || [],

    textAfterCheckItems: serviceRecordConfig?.textAfterCheckItems || '',
    isOperatorSignatureRequired: serviceRecordConfig?.isOperatorSignatureRequired || false,
    enableNote: serviceRecordConfig?.enableNote || false,
    enableMaintenanceRecommendations: serviceRecordConfig?.enableMaintenanceRecommendations || false,
    enableSuggestedSpares: serviceRecordConfig?.enableSuggestedSpares || false,
    // header
    headerType: { name: serviceRecordConfig?.header?.type } || null,
    headerLeftText: serviceRecordConfig?.header?.leftText || '',
    headerCenterText: serviceRecordConfig?.header?.centerText || '',
    headerRightText: serviceRecordConfig?.header?.rightText || '',
    // footer
    footerType: { name: serviceRecordConfig?.footer?.type } || null,
    footerLeftText: serviceRecordConfig?.footer?.leftText || '',
    footerCenterText: serviceRecordConfig?.footer?.centerText || '',
    footerRightText: serviceRecordConfig?.footer?.rightText || '',

    isActive: serviceRecordConfig?.isActive
  }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serviceRecordConfig]
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

  const { recordType, ListTitle, machineModel, checkItemCategory} = watch();

  /* eslint-disable */
  useLayoutEffect(() => {
    dispatch(getServiceRecordConfig(id));
    // dispatch(getActiveMachineModels())
    dispatch(getActiveCategories());
    dispatch(getActiveServiceCategories());
  }, [dispatch, id]);

  /* eslint-enable */
  useEffect(() => {
    setCheckParams(serviceRecordConfig?.checkItemLists || [])
  }, [serviceRecordConfig]);

  useEffect(() => {
    if (serviceRecordConfig) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceRecordConfig]);

  const toggleCancel = () => {
    dispatch(setServiceRecordConfigEditFormVisibility(false));
    navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.view(id));
  };
  const onSubmit = async (data) => {
    try {
      data.checkItemLists = checkParams
      if(isDraft){
        data.status = 'DRAFT'
      }else{
        data.status = 'SUBMITTED'
      }
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
    <>
      <StyledCardContainer>
        <Cover
          name={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_CONFIGS_EDIT}
          icon="material-symbols:category-outline"
          url={PATH_MACHINE.machines.settings.serviceRecordConfigs.list}
        />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                  <RHFTextField name="docTitle" label="Document Title" />

                  <RHFAutocomplete 
                    name="recordType"
                    label="Document Type"
                    value={recordType}
                    options={recordTypes}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />

                  <RHFTextField name="docVersionNo" disabled label="Version No.*" />
                  <RHFTextField name="noOfApprovalsRequired" label="Required Approvals*" />

                      <RHFAutocomplete
                        name="machineCategory" 
                        label="Machine Category"
                        options={activeCategories}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        getOptionLabel={(option) => `${option.name || ''}`}
                        renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                        onChange={async (event, newValue) => {
                          if (newValue) {
                            setValue('machineCategory',newValue);
                            if(newValue?._id !== machineModel?.category) {
                              setValue('machineModel',null)
                              await dispatch(resetActiveMachineModels())
                              await dispatch(getActiveMachineModels(newValue?._id))
                            }
                          } else {
                            setValue('machineCategory',null);
                            setValue('machineModel',null)
                              dispatch(resetActiveMachineModels())
                          }
                        }}
                    />
                  
                  <RHFAutocomplete 
                    name="machineModel"
                    label="Machine Model"
                    options={activeMachineModels}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li>
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
                  
                  <RHFSwitch  name="enableNote" label="Enable Note" />

                  <RHFSwitch name="enableMaintenanceRecommendations" label="Enable Maintenance Recommendations" />

                  <RHFSwitch name="enableSuggestedSpares" label="Enable Suggested Spares" /> 

                  <RHFSwitch name="isOperatorSignatureRequired" label="Is Operator Signature Required" />

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

                  <RHFSwitch name="isActive" label="Active" />

                <AddFormButtons machineSettingPage saveAsDraft={() => setDraft(true)} isDraft={isDraft} saveButtonName='submit' isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
