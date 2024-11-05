import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography, Container } from '@mui/material';
// slice
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { addServiceReportTemplate } from '../../../redux/slices/products/serviceReportTemplate';
import { getActiveMachineModels, resetActiveMachineModels } from '../../../redux/slices/products/model';
import { getActiveCategories, resetActiveCategories } from '../../../redux/slices/products/category';
import { getActiveServiceCategories } from '../../../redux/slices/products/serviceCategory';

// schema
import { ServiceReportTemplateSchema } from '../../schemas/machine';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete} from '../../../components/hook-form';
// util
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
// constants
import { FORMLABELS } from '../../../constants/default-constants';
import CheckItemTable from './CheckItemTable';
import { reportTypes } from '../../machine/util/index'

// ----------------------------------------------------------------------

export default function ServiceReportTemplateAddForm() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const { serviceReportTemplate } = useSelector((state) => state.serviceReportTemplate);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCategories } = useSelector((state) => state.category);
  const [checkParams, setCheckParams] = useState([]);
  const [checkItemList, setCheckItemList] = useState([]);
  const [isDraft, setDraft] = useState(false);
  const [ isCategoryModelLoaded, setIsCategoryModelLoaded ] = useState(false);

  useEffect(() => {
    dispatch(getActiveCategories())
    dispatch(getActiveMachineModels())
    dispatch(getActiveServiceCategories());
    return () => { dispatch(resetActiveMachineModels()); dispatch(resetActiveCategories()); }
  }, [dispatch]);

  useEffect(() => {
    if(id){
      setCheckParams(serviceReportTemplate?.checkItemLists || [])
    }
  }, [serviceReportTemplate, id]);

  const defaultValues = useMemo(
    () => ({
      reportTitle: id ? serviceReportTemplate?.reportTitle : '',
      reportType: id ? {name: serviceReportTemplate?.reportType} || null : null,
      docVersionNo: id ? typeof serviceReportTemplate?.docVersionNo === 'number' && serviceReportTemplate.docVersionNo + 1   : 1,
      noOfApprovalsRequired: id ? serviceReportTemplate?.noOfVerificationsRequired || 1 : 1,
      machineCategory: id ? serviceReportTemplate?.machineCategory :  null,
      machineModel:  id ? serviceReportTemplate?.machineModel || null :  null,
      textBeforeCheckItems:  id ? serviceReportTemplate?.textBeforeCheckItems || '' : '',
      ListTitle: '',
      checkItemCategory: null,
      textAfterCheckItems:  id ? serviceReportTemplate?.textAfterCheckItems || '' : '',
      isOperatorSignatureRequired:  id ? serviceReportTemplate?.isOperatorSignatureRequired : false,
      enableNote:  id ? serviceReportTemplate?.enableNote : false,
      enableMaintenanceRecommendations:  id ? serviceReportTemplate?.enableMaintenanceRecommendations : false,
      enableSuggestedSpares:  id ? serviceReportTemplate?.enableSuggestedSpares : false,
      // header
      headerType:  id ? { name: serviceReportTemplate?.header?.type } : null,
      headerLeftText:  id ? serviceReportTemplate?.header?.leftText || '' : '',
      headerCenterText:  id ? serviceReportTemplate?.header?.centerText || '' : '',
      headerRightText:  id ? serviceReportTemplate?.header?.rightText || '' : '',
      // footer
      footerType:  id ? { name: serviceReportTemplate?.footer?.type } : null,
      footerLeftText:  id ? serviceReportTemplate?.footer?.leftText || '' : '',
      footerCenterText:  id ? serviceReportTemplate?.footer?.centerText || '' : '',
      footerRightText:  id ? serviceReportTemplate?.footer?.rightText || '' : '',
      isActive: id ? serviceReportTemplate?.isActive : true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(ServiceReportTemplateSchema),
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
  
  const onSubmit = async (data) => {
    try {
      if(isDraft){
        data.status = 'DRAFT'
      }else{
        data.status = 'SUBMITTED'
      }
      if(id){
        data.parentTemplate = id
        data.originalTemplate = serviceReportTemplate?.originalTemplate ? serviceReportTemplate?.originalTemplate : id
      }
      data.checkItemLists = checkParams
      await dispatch(addServiceReportTemplate(data));
      reset();
      enqueueSnackbar('Service report template created successfully!');
      navigate(PATH_MACHINE.machines.machineSettings.serviceReportsTemplate.root);
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };
  
  const toggleCancel = () => navigate(PATH_MACHINE.machines.machineSettings.serviceReportsTemplate.root);

  const CategoryValHandler = (event, newValue) => {
    if (newValue) {
      setValue('machineCategory', newValue);
      dispatch(getActiveMachineModels(newValue?._id));
      if(  machineModel?.category?._id !== newValue?._id ){
        setValue('machineModel', null);
      }
    } else {
      setValue('machineCategory', null);
      setValue('machineModel', null);
      dispatch(getActiveMachineModels());
    }
  }

  const MachineModelValHandler = (event, newValue) => {
    if (newValue) {
      setValue('machineModel', newValue);
      if(machineCategory === null){
      dispatch(getActiveMachineModels(newValue?.category?._id));
      setValue('machineCategory', newValue?.category);
      }
    } else {
      setValue('machineModel', null);
    }
  }

  useEffect(() => {
    if(activeMachineModels.length > 0 && activeCategories.length > 0 ){
      if(!isCategoryModelLoaded && !id){
        if ( activeCategories.find((ele) => ele?.isDefault === true) === activeMachineModels.find((ele)=> ele.isDefault === true)?.category?._id || !activeMachineModels.some((ele)=> ele.isDefault === true) ){
          CategoryValHandler(null, activeCategories.find((ele) => ele?.isDefault === true) ) 
        } else {
          MachineModelValHandler(null, activeMachineModels.find((element)=> element.isDefault === true) )
        }
      }
      setIsCategoryModelLoaded(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[activeMachineModels, activeCategories, isCategoryModelLoaded])

  return (
  <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_CONFIGS_ADD}
          icon="material-symbols:category-outline"
          url={PATH_MACHINE.machines.machineSettings.serviceReportsTemplate.root}
        />
      </StyledCardContainer>
        <Grid container>
          <Grid item xs={18} md={12} >
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <RHFTextField name="reportTitle" label="Report Title*" />
                  <RHFAutocomplete 
                    name="reportType"
                    label="Report Type*"
                    options={reportTypes}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li>)}
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
                    onChange={(event, newValue) => CategoryValHandler(event, newValue)}
                  />
                  <RHFAutocomplete 
                    name="machineModel"
                    label="Machine Model"
                    options={activeMachineModels}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                    onChange={(event, newValue) => MachineModelValHandler(event, newValue)}
                  />
                </Box>
                  <RHFTextField name="textBeforeCheckItems" label="Text Before Check Items" minRows={3} multiline />
                    <CheckItemTable setCheckParams={setCheckParams} checkParams={checkParams} checkItemList={checkItemList} setCheckItemList={setCheckItemList} ListTitle={ListTitle} setValue={setValue} checkItemCategory={checkItemCategory} />
                  <RHFTextField name="textAfterCheckItems" label="Text After Check Items" minRows={3} multiline />
                
                <Box rowGap={2} columnGap={2} display="grid" 
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)',}}
                >
                  <RHFSwitch name="enableNote" label="Enable Note" />

                  <RHFSwitch name="enableMaintenanceRecommendations" label="Enable Maintenance Recommendations" />

                  <RHFSwitch name="enableSuggestedSpares" label="Enable Suggested Spares"/> 
                  
                  <RHFSwitch name="isOperatorSignatureRequired" label="Is Operator Signature Required" />
                  
                </Box>
                  
                <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary' }}>
                  Header
                </Typography>
            
                <Box rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)',}}
                >
                  <RHFTextField name="headerLeftText" label="Header Left Text" />
                  <RHFTextField name="headerCenterText" label="Header Center Text" />
                  <RHFTextField name="headerRightText" label="Header Right Text" />
                </Box>

                <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary' }}>
                  Footer
                </Typography>
        
                <Box rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)',}}
                >
                  <RHFTextField name="footerLeftText" label="Footer Left Text" />
                  <RHFTextField name="footerCenterText" label="Footer Center Text" />
                  <RHFTextField name="footerRightText" label="Footer Right Text" />
                </Box>
                
                  <RHFSwitch name="isActive" label="Active" />

                <AddFormButtons machineSettingPage saveAsDraft={() => setDraft(true)} isDisabled={checkItemList.length > 0} isDraft={isDraft} saveButtonName='submit' isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
    </Container>
  </FormProvider>
  );
}
