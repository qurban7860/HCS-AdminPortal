import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography, Container, Autocomplete, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CardContent, Link } from '@mui/material';
import { createTheme } from '@mui/material/styles';
// slice
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { addServiceRecordConfig } from '../../../redux/slices/products/serviceRecordConfig';
import { getActiveMachineServiceParams } from '../../../redux/slices/products/machineServiceParams';
import { getActiveMachineModels, resetActiveMachineModels } from '../../../redux/slices/products/model';
import { getActiveCategories } from '../../../redux/slices/products/category';

// schema
import { AddMachineSchema } from '../../schemas/document';
// routes
import { PATH_DASHBOARD, PATH_MACHINE } from '../../../routes/paths';
import { useSettingsContext } from '../../../components/settings';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFMultiSelect , RHFAutocomplete} from '../../../components/hook-form';
// util
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
// constants
import Iconify from '../../../components/iconify';
import { FORMLABELS } from '../../../constants/default-constants';
import { Snacks, FORMLABELS as formLABELS } from '../../../constants/document-constants';
import useResponsive from '../../../hooks/useResponsive';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function ServiceRecordConfigAddForm() {
  const [open, setOpen] = useState(false);
  const [sortedMachineServiceParams, setSortedMachineSerivceParams] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isMobile = useResponsive('down', 'sm');
  const theme = createTheme();
  const { recordTypes, headerFooterTypes } = useSelector((state) => state.serviceRecordConfig);
  const { activeMachineServiceParams } = useSelector((state) => state.machineServiceParam);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCategories } = useSelector((state) => state.category);
  const [checkParamNumber, setCheckParamNumber]= useState(0);
  const [checkParam, setCheckParam] = useState({});
  const [checkParams, setCheckParams] = useState([]);
  
  useLayoutEffect(() => {
    dispatch(getActiveMachineServiceParams());
    dispatch(getActiveCategories());
  }, [dispatch]);


  
  const AddMachineServiceRecordConfigSchema = Yup.object().shape({
    recordType: Yup.object().label('Record Type').nullable().required(),
    machineModel: Yup.object().label('Model').nullable(),
    category: Yup.object().label('Category').nullable(),
    docTitle: Yup.string().max(40).label('Document Title'),
    textBeforeCheckItems: Yup.string().max(4000),
    // Check Params
    paramListTitle: Yup.string(),
    paramList : Yup.array(),

    textAfterCheckItems: Yup.string().max(4000),
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
      recordType: null,
      machineModel: null,
      category: null,
      docTitle: '',
      textBeforeCheckItems: '',

      // Check Params
      paramListTitle: '',
      paramList : [],

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

  const { category, machineModel } = watch();
  useEffect(() => {
    if(category === null){
      dispatch(resetActiveMachineModels())
      setValue('machineModel',null);
    }else{
      dispatch(getActiveMachineModels(category?._id));
    }
  },[dispatch, category,setValue]);

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.list);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedCheckParam = {
      ...checkParam,
      [name]: value,
    };
    setCheckParam(updatedCheckParam);
  };

  const onSubmit = async (data) => {
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
    const updatedCheckParam = [...checkParams]; // Clone the state
    const [draggedRow] = updatedCheckParam[checkParamNumber].paramList.splice(draggedIndex, 1);
    updatedCheckParam[checkParamNumber].paramList.splice(index, 0, draggedRow);
    setCheckParams(updatedCheckParam); // Set the state with the updated value
  };

  const handleRowDelete = (index) => {
    const updatedRows = [...checkParams];
    updatedRows[checkParamNumber].paramList.splice(index, 1);
    setCheckParams(updatedRows);
  };
  const toggleEdit = (index) => {setCheckParam(checkParams[index]); setCheckParamNumber(index); };
  const deleteIndex = (indexToRemove) => {
    const newArray =  checkParams.filter((_, index) => index !== indexToRemove);
    setCheckParams(newArray);
    
  };
  const saveCheckParam = (prevCheckParamNumber) =>{
    const updatedCheckParam = [...checkParams]; 
    if(prevCheckParamNumber > checkParams.length-1) {
      updatedCheckParam.splice(prevCheckParamNumber, 0, checkParam);
      setCheckParams(updatedCheckParam);
      setCheckParamNumber(() => prevCheckParamNumber + 1) 
    }else if(prevCheckParamNumber < checkParams.length-1){
      updatedCheckParam[prevCheckParamNumber]= checkParam;
      setCheckParams(updatedCheckParam);
    }
    else if(prevCheckParamNumber === checkParams.length-1){
      updatedCheckParam[prevCheckParamNumber]= checkParam;
      setCheckParams(updatedCheckParam);
      setCheckParamNumber(() => prevCheckParamNumber + 1) 
    }

    setCheckParam({})
  }
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_CONFIGS_ADD}
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
                  <RHFAutocomplete 
                    name="recordType"
                    label="Record Type"
                    options={recordTypes}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />

                  <RHFTextField name="docTitle" label="Document Title" />

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
                
                <Card sx={{ p: 3 }}>
                    <Stack spacing={2}>
                    <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary' }}>
                      Check Items
                    </Typography>
                    <RHFTextField name="paramListTitle" label="Item List Title" 
                        value={checkParam?.paramListTitle || ''}
                        onChange={(event) => handleInputChange(event, checkParamNumber)} 
                      />
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
                    <Card sx={{ minWidth: 250, width: '100%', minHeight:260 , my:3, border:'1px solid'}}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell size='small' align='left'>Checked Items</TableCell>
                              <TableCell size='small' align='right'>{`  `}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {checkParam?.paramList?.map((row, index) => (
                              <TableRow
                                key={row.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, index)}
                              >
                                <TableCell size='small' align='left' ><b>{`${index+1}). `}</b>{`${row.name}`}</TableCell>
                                <TableCell size='small' align='right'>
                                <ViewFormEditDeleteButtons onDelete={() => handleRowDelete(index)} />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Card>
                      <Grid display="flex" justifyContent="flex-end" sx={{width: '100%'}}>
                        <Button
                          disabled={!checkParam?.paramList?.length > 0}
                          onClick={()=>saveCheckParam(checkParamNumber)}
                          fullWidth={ isMobile }
                          variant="contained" color='primary' sx={{ ...(isMobile && { width: '100%' })}}
                        >Save</Button>
                      </Grid>
                    </Grid>
                    <Stack sx={{ minWidth: 250,  minHeight:260 , my:3}}>

                    <TableContainer >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell size='small' align='left'>Check Item Title</TableCell>
                            <TableCell size='small' align='center'>Items</TableCell>
                            <TableCell size='small' align='right'>{`  `}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {checkParams.map((value, index) =>( typeof value?.paramList?.length === 'number' &&
                          <TableRow
                                  key={index}
                                  draggable
                                  onDragStart={(e) => handleListDragStart(e, index)}
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={(e) => handleListDrop(e, index)}
                                  // sx={{border:'1px solid', borderRadius:'10px',my:1}}
                                >
                                <TableCell size='small' align='left' >{typeof value?.paramListTitle === 'string' && value?.paramListTitle || ''}</TableCell>
                                <TableCell size='small' align='center' >{`${value?.paramList?.length}`}</TableCell>
                                <TableCell size='small' align='right' >
                                    <ViewFormEditDeleteButtons handleEdit={()=>toggleEdit(index)} onDelete={()=>deleteIndex(index)} />
                                </TableCell>
                          </TableRow>
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
                    isOptionEqualToValue={(option, value) => option._id === value._id}
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
