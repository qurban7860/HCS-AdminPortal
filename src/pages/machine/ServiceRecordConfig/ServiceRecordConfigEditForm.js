import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack, Typography, Container,  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Autocomplete, TextField} from '@mui/material';
// slice
import {
  updateServiceRecordConfig,
  setServiceRecordConfigEditFormVisibility,
  getServiceRecordConfig,
} from '../../../redux/slices/products/serviceRecordConfig';
import { getActiveMachineModels, resetActiveMachineModels } from '../../../redux/slices/products/model';
import { getActiveMachineServiceParams } from '../../../redux/slices/products/machineServiceParams';
import { getActiveCategories } from '../../../redux/slices/products/category';
import { ServiceRecordConfigSchema } from '../../schemas/machine';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../components/hook-form';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
// import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
// constants
// import { FORMLABELS } from '../../../constants/default-constants';
import useResponsive from '../../../hooks/useResponsive';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import { FORMLABELS } from '../../../constants/default-constants';
import CollapsibleCheckedItemRow from './CollapsibleCheckedItemRow';


// ----------------------------------------------------------------------

export default function ServiceRecordConfigEditForm() {
  const { serviceRecordConfig, recordTypes, headerFooterTypes } = useSelector((state) => state.serviceRecordConfig);
  const { activeMachineServiceParams } = useSelector((state) => state.machineServiceParam);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCategories } = useSelector((state) => state.category);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const isMobile = useResponsive('down', 'sm');

  const [checkParamNumber, setCheckParamNumber]= useState(serviceRecordConfig.checkParams.length);
  const [checkParam, setCheckParam] = useState({});
  const [checkParams, setCheckParams] = useState([]);
console.log("checkParams : ", checkParams)
console.log("serviceRecordConfig : ",serviceRecordConfig)
  const defaultValues = useMemo(
    () => ({
    recordType: {name: serviceRecordConfig?.recordType} || null,
    machineModel: serviceRecordConfig?.machineModel || null,
    category: serviceRecordConfig?.category || null,
    docTitle: serviceRecordConfig?.docTitle || '',
    textBeforeCheckItems: serviceRecordConfig?.textBeforeCheckItems || '',

    // // Check Params
    paramListTitle: checkParam.paramListTitle || '',
    // paramList : serviceRecordConfig?.checkParams[0]?.paramList || [],

    textAfterCheckItems: serviceRecordConfig?.textAfterCheckItems || '',
    isOperatorSignatureRequired: serviceRecordConfig?.isOperatorSignatureRequired || false,
    enableServiceNote: serviceRecordConfig?.enableServiceNote || false,
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

    isActive: serviceRecordConfig.isActive
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
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { recordType, paramListTitle, category, machineModel, } = watch();




  /* eslint-disable */
  useLayoutEffect(() => {
    dispatch(getServiceRecordConfig(id));
    // dispatch(getActiveMachineModels())
    dispatch(getActiveCategories());
  }, [dispatch, id]);

  useEffect(() => {
    if(serviceRecordConfig?.category?._id){
      dispatch(getActiveMachineServiceParams(serviceRecordConfig?.category?._id));
    }
  },[serviceRecordConfig, dispatch])
  /* eslint-enable */
  useEffect(() => {
    setCheckParams(serviceRecordConfig?.checkParams)
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
      data.checkParam = checkParams
      // console.log(data);
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedCheckParam = {
      ...checkParam,
      [name]: value,
    };
    setCheckParam(updatedCheckParam);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };

  const handleListDrop = (e, index) => {
    const draggedIndex = e.dataTransfer.getData('index');
    const updatedCheckParam = [...checkParams];
    const [draggedRow] = updatedCheckParam.splice(draggedIndex, 1);
    updatedCheckParam.splice(index, 0, draggedRow);
    setCheckParams(updatedCheckParam); 
    if(draggedIndex > checkParamNumber && index <= checkParamNumber ){
      setCheckParamNumber(prevCheckParamNumber => prevCheckParamNumber + 1)
    }else if(draggedIndex < checkParamNumber && index >= checkParamNumber){
      setCheckParamNumber(prevCheckParamNumber => prevCheckParamNumber - 1)
    }else if(Number(draggedIndex) === checkParamNumber && index > checkParamNumber){
      setCheckParamNumber(prevCheckParamNumber => prevCheckParamNumber + 1)
    }else if(Number(draggedIndex) === checkParamNumber && index < checkParamNumber){
      setCheckParamNumber(prevCheckParamNumber => prevCheckParamNumber - 1)
    }
  };

  const handleListDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };

  const handleDrop = (e, index) => {
    const draggedIndex = e.dataTransfer.getData('index');
    const updatedCheckParam = {
      paramListTitle: checkParam.paramListTitle,
      paramList: [...checkParam.paramList],
    };
    const [draggedRow] = updatedCheckParam.paramList.splice(draggedIndex, 1);
    updatedCheckParam.paramList.splice(index, 0, draggedRow);
    setCheckParam(updatedCheckParam); 
  };


  const handleRowDelete = (index) => {
    try {
      const updatedList = [...checkParam.paramList]; // Create a copy of the paramList
      updatedList.splice(index, 1); // Modify the copy
      
      const updatedRow = {
        paramListTitle: checkParam.paramListTitle,
        paramList: updatedList, // Use the modified copy
      };
      
      enqueueSnackbar('Deleted success!');
      setCheckParam(updatedRow); // Update the state with the modified copy
      
    } catch (err) {
      enqueueSnackbar('Delete failed!', { variant: 'error' });
      console.error(err.message);
    }
  };

  const toggleEdit = (index) => {
    setCheckParam({...checkParams[index]}); 
    setCheckParamNumber(index); 
    setValue('paramListTitle',checkParams[index]?.paramListTitle) };

  const deleteIndex = (indexToRemove) => {
    try {
      const newArray =  checkParams.filter((_, index) => index !== indexToRemove);
      setCheckParams(newArray);
      enqueueSnackbar('Deleted success!');
    } catch (err) {
      enqueueSnackbar('Delete failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  const saveCheckParam = (prevCheckParamNumber) =>{
    try {
      checkParam.paramListTitle = paramListTitle
      setValue('paramListTitle','')
      const updatedCheckParam = [...checkParams]; 
      if(prevCheckParamNumber > checkParams.length-1) {
        updatedCheckParam.splice(prevCheckParamNumber, 0, checkParam);
        setCheckParams(updatedCheckParam);
        setCheckParamNumber(() => prevCheckParamNumber + 1) 
      enqueueSnackbar('Saved success!');
      }else if(prevCheckParamNumber < checkParams.length-1){
        updatedCheckParam[prevCheckParamNumber]= checkParam;
        setCheckParams(updatedCheckParam);
        setCheckParamNumber(checkParams.length) 
      enqueueSnackbar('Updated success!');
      }
      else if(prevCheckParamNumber === checkParams.length-1){
        updatedCheckParam[prevCheckParamNumber]= checkParam;
        setCheckParams(updatedCheckParam); 
        setCheckParamNumber(checkParams.length) 

      enqueueSnackbar('Updated success!');
      }
      setCheckParam({})
    } catch (err) {
      enqueueSnackbar('Save failed!', { variant: `error` });
      console.error(err.message);
    }
  }

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_CONFIGS_EDIT}
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
                  <RHFTextField name="docTitle" label="Document Title" />

                  <RHFAutocomplete 
                    name="recordType"
                    label="Record Type"
                    value={recordType}
                    options={recordTypes}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />

  {/* 
  // useEffect(() => {
  //   if(category === null){
  //     dispatch(resetActiveMachineModels())
  //     setValue('machineModel',null);
  //   }else if(category?._id === machineModel?.category?._id){
  //     dispatch(getActiveMachineModels(category?._id));
  //   }else if(category?._id !== machineModel?.category){
  //     dispatch(getActiveMachineModels(category?._id));
  //     setValue('machineModel',null);
  //   }
  // },[dispatch, category,setValue,machineModel]); 
  */}
                  <Controller
                    name="category"
                    control={control}
                    defaultValue={category || null}
                    render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        options={activeCategories}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                        )}
                        onChange={async (event, newValue) => {
                          if (newValue) {
                            field.onChange(newValue);
                            if(newValue?._id !== machineModel?.category) {
                              setValue('machineModel',null)
                              await dispatch(resetActiveMachineModels())
                              await dispatch(getActiveMachineModels(newValue?._id))
                            }
                          } else {
                            field.onChange(null);
                            setValue('machineModel',null)
                              dispatch(resetActiveMachineModels())
                          }
                        }}
                        renderInput={(params) => (<TextField {...params} name="category" label="Machine Category" 
                          error={!!error}
                          helperText={error?.message} 
                          inputRef={ref} 
                        />)}
                    />
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

                  <Card sx={{ p: 3 }}>
                    <Stack spacing={2}>
                    <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary' }}>
                      Check Items
                    </Typography>
                    <RHFTextField name="paramListTitle" label="Item List Title*" />
                      <RHFAutocomplete
                        multiple
                        name="paramList"
                        label="Select Items"
                        value={checkParam?.paramList || []}
                        options={activeMachineServiceParams}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                        )}
                        onChange={(event, newValue) => {
                          const updatedEvent = { target: { name: "paramList", value: newValue }};
                          handleInputChange(updatedEvent, checkParamNumber);
                          event.preventDefault();
                        }}
                        renderTags={(value, getTagProps) => ''}
                      /> 
                      <Grid container item md={12} >
                      <Card sx={{ minWidth: 250, width: '100%', minHeight:75 , my:3, border:'1px solid'}}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell size='small' align='left'>Checked Items</TableCell>
                              <TableCell size='small' align='right'>{`  `}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {checkParam?.paramList?.length > 0 && (checkParam?.paramList?.map((row, index) => (
                              <TableRow
                                key={row.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, index)}
                              >
                                <TableCell size='small' align='left' ><b>{`${index+1}). `}</b>{`${row.name}`}</TableCell>
                                <TableCell size='small' align='right'>
                                <ViewFormEditDeleteButtons onDelete={() => handleRowDelete(index)} sm/>
                                </TableCell>
                              </TableRow>
                            ))) }
                          </TableBody>
                        </Table>
                        <Grid item md={12} display='flex' justifyContent='center' >
                            {checkParam?.paramList?.length === 0 && (<Typography variant="subtitle2" sx={{ mt:0.7}}>No Checked Items selected</Typography>)}
                          </Grid>
                      </Card>
                      <Grid display="flex" justifyContent="flex-end" sx={{width: '100%'}}>
                        <Button
                          disabled={(!checkParam?.paramList?.length ?? 0) || (!paramListTitle ?? '') }
                          onClick={()=>saveCheckParam(checkParamNumber)}
                          fullWidth={ isMobile }
                          variant="contained" color='primary' sx={{ ...(isMobile && { width: '100%' })}}
                        >Save</Button>
                      </Grid>
                    </Grid>
                    <Stack sx={{ minWidth: 250,  minHeight:75 }}>
                    <TableContainer >
                      <Table>
                        <TableBody>
                          {checkParams.map((value, index) =>( typeof value?.paramList?.length === 'number' &&
                          <CollapsibleCheckedItemRow value={value} index={index} toggleEdit={toggleEdit} deleteIndex={deleteIndex} handleListDragStart={handleListDragStart} handleListDrop={handleListDrop} />
                          ))}
                      </TableBody>
                      </Table>
                      </TableContainer>
                      </Stack>
                    </Stack>
                  </Card>

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
                    // value={headerType}
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
                    // value={footerTyname
                    isOptionEqualToValue={(option, value) => option.name === value.name}
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
