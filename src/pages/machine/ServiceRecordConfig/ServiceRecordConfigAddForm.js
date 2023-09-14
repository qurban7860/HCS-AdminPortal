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
import { addServiceRecordConfig } from '../../../redux/slices/products/serviceRecordConfig';
import { getActiveMachineModels, resetActiveMachineModels } from '../../../redux/slices/products/model';
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
  const { recordTypes, headerFooterTypes } = useSelector((state) => state.serviceRecordConfig);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCategories } = useSelector((state) => state.category);
  const [checkParams, setCheckParams] = useState([]);

  
  useLayoutEffect(() => {
    dispatch(getActiveCategories());
  }, [dispatch]);

const CheckParamSchema = Yup.object().shape({
  paramListTitle: Yup.string().max(200).label('Item List Title').required(),
  paramList : Yup.array(),
})

  const defaultValues = useMemo(
    () => ({
      recordType: null,
      machineModel: null,
      category: null,
      docTitle: '',
      textBeforeCheckItems: '',

      textAfterCheckItems: '',
      isOperatorSignatureRequired: false,
      enableServiceNote: false,
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
    resolver: yupResolver(ServiceRecordConfigSchema,CheckParamSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { category, machineModel, paramListTitle } = watch();
// console.log("paramListTitle : ",paramListTitle)
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

  const onSubmit = async (event, data) => {
    event.preventDefault();
    try {
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

                  <RHFAutocomplete 
                    name="recordType"
                    label="Record Type*"
                    options={recordTypes}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />

                  <RHFTextField name="docTitle" label="Document Title*" />

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

                      <CheckItemTable setCheckParams={setCheckParams} checkParams={checkParams} paramListTitle={paramListTitle} setValue={setValue}/>
                  <RHFTextField name="textAfterCheckItems" label="Text After Check Items" minRows={3} multiline />
                
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
                  Header
                </Typography>
                <RHFAutocomplete 
                    name="headerType" label="Header Type"
                    options={headerFooterTypes}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />
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
                <RHFAutocomplete 
                    name="footerType" 
                    label="Footer Type"
                    options={headerFooterTypes}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />
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
    </Container>
  </FormProvider>
  );
}
