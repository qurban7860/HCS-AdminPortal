import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack, Typography, Container, Autocomplete, TextField, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, CardContent } from '@mui/material';
import { createTheme } from '@mui/material/styles';
// slice
import {
  updateServiceRecordConfig,
  setServiceRecordConfigEditFormVisibility,
  getServiceRecordConfig,
} from '../../../redux/slices/products/serviceRecordConfig';
import { getActiveMachineModels } from '../../../redux/slices/products/model';
import { getActiveMachineServiceParams } from '../../../redux/slices/products/machineServiceParams';
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
import useResponsive from '../../../hooks/useResponsive';
import  IconTooltip  from '../../components/Icons/IconTooltip'
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function ServiceRecordConfigEditForm() {
  const { serviceRecordConfig, recordTypes, headerFooterTypes } = useSelector((state) => state.serviceRecordConfig);
  const { activeMachineServiceParams } = useSelector((state) => state.machineServiceParam);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const isMobile = useResponsive('down', 'sm');
  const theme = createTheme();

  const [checkParamNumber, setCheckParamNumber]= useState(0);
  const [checkParam, setCheckParam] = useState([]);

  const EditServiceRecordConfigSchema = Yup.object().shape({
    recordType: Yup.object().label('Record Type').nullable(),
    machineModel: Yup.object().label('Model').nullable(),
    category: Yup.object().label('Category').nullable(),
    docTitle: Yup.string().required(),
    textBeforeParams: Yup.string(),
    // Check Params
    // paramListTitle: Yup.string(),
    // paramList : Yup.array(),

    textAfterFields: Yup.string(),
    isOperatorSignatureRequired: Yup.boolean(),
    enableServiceNote: Yup.boolean(),
    enableMaintenanceRecommendations: Yup.boolean(),
    enableSuggestedSpares: Yup.boolean(),

    // header
    headerType: Yup.object().label('Header Type').nullable(),
    headerLeftText: Yup.string(),
    headerCenterText: Yup.string(),
    headerRightText: Yup.string(),

    // footer
    footerType: Yup.object().label('Footer Type').nullable(),
    footerLeftText: Yup.string(),
    footerCenterText: Yup.string(),
    footerRightText: Yup.string(),

    isActive: Yup.boolean()
  });

  const defaultValues = useMemo(
    () => ({
    recordType: {name: serviceRecordConfig?.recordType} || null,
    machineModel: serviceRecordConfig?.machineModel || null,
    category: serviceRecordConfig?.category || null,
    docTitle: serviceRecordConfig?.docTitle || '',
    textBeforeParams: serviceRecordConfig?.textBeforeParams || '',

    // // Check Params
    // paramListTitle: serviceRecordConfig?.checkParams[0]?.paramListTitle || '',
    // paramList : serviceRecordConfig?.checkParams[0]?.paramList || [],

    textAfterFields: serviceRecordConfig?.textAfterFields || '',
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

  const { recordType, machineModel } = watch();

  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeServiceCategories } = useSelector((state) => state.serviceCategory);


  /* eslint-disable */
  useLayoutEffect(() => {
    dispatch(getServiceRecordConfig(id));
    dispatch(getActiveMachineModels())
    dispatch(getActiveMachineServiceParams());
    dispatch(getActiveServiceCategories());
  }, [dispatch, id]);
  /* eslint-enable */
  useEffect(() => {
    setCheckParam(serviceRecordConfig?.checkParams)
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
      console.log(data);
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

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedCheckParam = [...checkParam];
    updatedCheckParam[index] = {
      ...updatedCheckParam[index],
      [name]: value,
    };
    setCheckParam(updatedCheckParam);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };

  const handleListDrop = (e, index) => {
    const draggedIndex = e.dataTransfer.getData('index');
    const updatedCheckParam = [...checkParam];
    const [draggedRow] = updatedCheckParam.splice(draggedIndex, 1);
    updatedCheckParam.splice(index, 0, draggedRow);
    setCheckParam(updatedCheckParam); 
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
    const updatedCheckParam = [...checkParam]; // Clone the state
    const [draggedRow] = updatedCheckParam[checkParamNumber].paramList.splice(draggedIndex, 1);
    updatedCheckParam[checkParamNumber].paramList.splice(index, 0, draggedRow);
    setCheckParam(updatedCheckParam); // Set the state with the updated value
  };

  const handleRowDelete = (index) => {
    const updatedRows = [...checkParam];
    updatedRows[checkParamNumber].paramList.splice(index, 1);
    setCheckParam(updatedRows);
  };
  
  const toggleEdit = (index) => {setCheckParamNumber(index)};

  const onDelete = (indexToRemove) => {
    const newArray =  checkParam.filter((_, index) => index !== indexToRemove);
      setCheckParam(newArray);
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
                  {/* <Autocomplete
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
                  /> */}
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
                <Card sx={{ p: 3 }}>
                    <Stack spacing={2}>
                    <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary' }}>
                      Check Items
                    </Typography>
                    <RHFTextField name="paramListTitle" label="Item List Title" 
                        value={checkParam[checkParamNumber]?.paramListTitle || ''}
                        onChange={(event) => handleInputChange(event, checkParamNumber)} 
                      />
                    <Box rowGap={2} columnGap={2} display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                      }}
                    >
                      <RHFAutocomplete
                        multiple
                        name="paramList"
                        label="Item List"
                        value={checkParam[checkParamNumber]?.paramList || []}
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
                        renderTags={(value, getTagProps) => `${value.length} Items Selected!`}
                      /> 
                    </Box>
                  <Grid container item md={12} >
                    <Card sx={{ minWidth: 360, width: '100%', minHeight:260 , my:3, border:'1px solid'}}>
                    <TableContainer component={Paper}  >
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>No.</TableCell>
                              <TableCell>Checked Items</TableCell>
                              <TableCell>Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {checkParam[checkParamNumber]?.paramList?.map((row, index) => (
                              <TableRow
                                key={row.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, index)}
                              >
                                <TableCell>{index+1}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>
                                  <IconTooltip
                                    title='Delete'
                                    color={theme.palette.error.light}
                                    icon="mdi:trash-can-outline"
                                    onClick={() => handleRowDelete(index)}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      </Card>
                      <Grid display="flex" justifyContent="flex-end" sx={{width: '100%'}}>
                        <Button
                          disabled={!checkParam[checkParamNumber]?.paramList?.length > 0}
                          onClick={ () => setCheckParamNumber(prevCheckParamNumber => prevCheckParamNumber + 1) }
                          fullWidth={ isMobile }
                          variant="contained" color='primary' sx={{ ...(isMobile && { width: '100%' })}}
                        >Next
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid>
                      <Grid container justifyContent="flex-start" gap={1}>
                      {checkParam.map((value, index) =>( typeof value?.paramList?.length === 'number' &&
                        <TableRow
                                draggable
                                onDragStart={(e) => handleListDragStart(e, index)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleListDrop(e, index)}
                              >
                        <Card sx={{p:2, width:'125px' ,border:'1px solid'}}>
                          <CardContent sx={{ mt:-3, mr:-5, mb:1,display:'flex', justifyContent:'flex-end'}} >
                              <ViewFormEditDeleteButtons handleEdit={()=>toggleEdit(index)} onDelete={()=>onDelete(index)} />
                          </CardContent>
                          <Typography variant='overline' sx={{ ml:1}}  >Items: {`${value?.paramList?.length}`}</Typography>
                        </Card>
                        </TableRow>
                      ))}
                      </Grid>
                    </Grid>
                    </Stack>
                  </Card>
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
