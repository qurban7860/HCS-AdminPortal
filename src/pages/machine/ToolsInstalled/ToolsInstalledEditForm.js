import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import {
  Switch,
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  DialogTitle,
  Dialog,
  InputAdornment,
  Link,
  Autocomplete,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// global
import { CONFIG } from '../../../config-global';
// slice
import {
  setToolInstalledEditFormVisibility,
  updateToolInstalled,
} from '../../../redux/slices/products/toolInstalled';
import { getTools } from '../../../redux/slices/products/tools';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch,
} from '../../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function ToolsInstalledEditForm() {
  const { tools } = useSelector((state) => state.tool);
  const {
    toolsInstalled,
    toolInstalled,
    toolTypes,
    formVisibility,
  } = useSelector((state) => state.toolInstalled);
  const [toolVal, setToolVal] = useState('');
  const [toolType, setToolType] = useState('');
  const { machine } = useSelector((state) => state.machine);

  const [singleTool, setSingleTool] = useState(false);
  const [compositeTool, setCompositeTool] = useState(false);
 
  const [timeOut, setTimeOut] = useState(null);
  const [engagingDuration, setEngagingDuration] = useState(null);
  const [returningDuration, setReturningDuration] = useState(null);
  const [twoWayCheckDelayTime, setTwoWayCheckDelayTime] = useState(null);


  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    setToolVal(toolInstalled.tool);
    setToolType(toolInstalled.toolType);
    if(toolInstalled?.singleToolConfig?.engagingDuration){
      setEngagingDuration(toolInstalled?.singleToolConfig?.engagingDuration);
    }
    if(toolInstalled?.singleToolConfig?.timeOut){
      setTimeOut(toolInstalled?.singleToolConfig?.timeOut);
    }
    if(toolInstalled?.singleToolConfig?.returningDuration){
      setReturningDuration(toolInstalled?.singleToolConfig?.returningDuration);
    }
    if(toolInstalled?.singleToolConfig?.twoWayCheckDelayTime){
      setTwoWayCheckDelayTime(toolInstalled?.singleToolConfig?.twoWayCheckDelayTime);
    }
    if(toolInstalled?.toolType === 'SINGLE TOOL'){
      setSingleTool(true);
    }
    if(toolInstalled?.toolType === 'COMPOSITE TOOL'){
      setCompositeTool(true);
    }
    dispatch(getTools());
  }, [dispatch, toolInstalled]);

  const EditSettingSchema = Yup.object().shape({
    tool: Yup.string(),

    offset: Yup.number()
    .typeError('Offset must be a number')
    .transform((value, originalValue) => {
  
  
    if (originalValue.toString().trim() === '') return undefined;
    return parseFloat(value);
    })
    .test('no-spaces', 'Offset cannot have spaces', value => !(value && value.toString().includes(' '))),

    wasteTriggerDistance: Yup.number()
    .typeError('Waste Trigger Distance must be a number')
    .transform((value, originalValue) => {

    if (originalValue.toString().trim() === '') return undefined;
    return parseFloat(value);
    })
    .test('no-spaces', 'Waste Trigger Distance cannot have spaces', value => !(value && value.toString().includes(' '))),

    crimpTriggerDistance: Yup.number()
    .typeError('Crimp Trigger Distance must be a number')
    .transform((value, originalValue) => {
  

    if (originalValue.toString().trim() === '') return undefined;
    return parseFloat(value);
    })
    .test('no-spaces', 'Crimp Trigger Distance cannot have spaces', value => !(value && value.toString().includes(' '))),

    operations: Yup.number()
    .typeError('Operations must be a number')
    .transform((value, originalValue) => {
  

    if (originalValue.toString().trim() === '') return undefined;
    return parseFloat(value);
    })
    .test('no-spaces', 'Operations cannot have spaces', value => !(value && value.toString().includes(' '))),
    
    toolType: Yup.string(),
    isApplyWaste: Yup.boolean(),
    isApplyCrimp: Yup.boolean(),
    isBackToBackPunch: Yup.boolean(),
    isManualSelect: Yup.boolean(),
    isAssign: Yup.boolean(),
    isActive: Yup.boolean(),


    // --------------------------------------SINGLE TOOL CONFIGURATION-------------------------------------
    engageSolenoidLocation: Yup.number()
      .typeError('Offset must be a number')
      .transform((value, originalValue) => {
      if (originalValue.trim() === '') return undefined;
      return parseFloat(value);
      }).test('no-spaces', 'Offset cannot have spaces', value => !(value && value.toString().includes(' '))),
    returnSolenoidLocation: Yup.number()
      .typeError('Offset must be a number')
      .transform((value, originalValue) => {
      if (originalValue.trim() === '') return undefined;
      return parseFloat(value);
      }).test('no-spaces', 'Offset cannot have spaces', value => !(value && value.toString().includes(' '))),
    engageOnCondition: Yup.number()
      .typeError('Offset must be a number')
      .transform((value, originalValue) => {
      if (originalValue.trim() === '') return undefined;
      return parseFloat(value);
      }).test('no-spaces', 'Offset cannot have spaces', value => !(value && value.toString().includes(' '))),
    homeProximitySensorLocation: Yup.number()
      .typeError('Offset must be a number')
      .transform((value, originalValue) => {
      if (originalValue.trim() === '') return undefined;
      return parseFloat(value);
      }).test('no-spaces', 'Offset cannot have spaces', value => !(value && value.toString().includes(' '))),
    engagedProximitySensorLocation: Yup.number()
      .typeError('Offset must be a number')
      .transform((value, originalValue) => {
      if (originalValue.trim() === '') return undefined;
      return parseFloat(value);
      }).test('no-spaces', 'Offset cannot have spaces', value => !(value && value.toString().includes(' '))),
    pressureTarget: Yup.number()
      .typeError('Offset must be a number')
      .transform((value, originalValue) => {
      if (originalValue.trim() === '') return undefined;
      return parseFloat(value);
      }).test('no-spaces', 'Offset cannot have spaces', value => !(value && value.toString().includes(' '))),
    distanceSensorLocation: Yup.number()
      .typeError('Offset must be a number')
      .transform((value, originalValue) => {
      if (originalValue.trim() === '') return undefined;
      return parseFloat(value);
      }).test('no-spaces', 'Offset cannot have spaces', value => !(value && value.toString().includes(' '))),
    distanceSensorTarget: Yup.number()
      .typeError('Offset must be a number')
      .transform((value, originalValue) => {
      if (originalValue.trim() === '') return undefined;
      return parseFloat(value);
      }).test('no-spaces', 'Offset cannot have spaces', value => !(value && value.toString().includes(' '))),
    isHasTwoWayCheck: Yup.boolean(),
    isEngagingHasEnable: Yup.boolean(),
    isReturningHasEnable: Yup.boolean(),
    engageOffCondition: Yup.boolean(),
    movingPunchCondition: Yup.string() // { type: String, default: 'NO PUNCH' },  
  });

  const defaultValues = useMemo(
    () => ({
      // tool: toolInstalled?.tool || '',
      toolName: toolInstalled?.tool?.name || '',  
      offset: toolInstalled?.offset || '',
      wasteTriggerDistance: toolInstalled?.wasteTriggerDistance || '',
      crimpTriggerDistance: toolInstalled?.crimpTriggerDistance || '',
      isApplyWaste: toolInstalled?.isApplyWaste || false,
      isApplyCrimp: toolInstalled?.isApplyCrimp || false,
      isBackToBackPunch: toolInstalled?.isBackToBackPunch || false,
      isManualSelect: toolInstalled?.isManualSelect || false,  
      isAssign: toolInstalled?.isAssign || false,
      operations: toolInstalled?.operations || '',
      toolType: toolInstalled?.toolType || '',
      isActive: toolInstalled?.isActive,
      note: toolInstalled?.note || '',

      
      engageSolenoidLocation: toolInstalled?.singleToolConfig?.engageSolenoidLocation || '',
      returnSolenoidLocation: toolInstalled?.singleToolConfig?.returnSolenoidLocation || '',
      engageOnCondition: toolInstalled?.singleToolConfig?.engageOnCondition || '',
      engageOffCondition: toolInstalled?.singleToolConfig?.engageOffCondition || false,   
      homeProximitySensorLocation: toolInstalled?.singleToolConfig?.homeProximitySensorLocation || '',
      engagedProximitySensorLocation: toolInstalled?.singleToolConfig?.engagedProximitySensorLocation || '',
      pressureTarget: toolInstalled?.singleToolConfig?.pressureTarget ||  '',
      distanceSensorLocation: toolInstalled?.singleToolConfig?.distanceSensorLocation || '',
      distanceSensorTarget: toolInstalled?.singleToolConfig?.distanceSensorTarget || '',
      isHasTwoWayCheck: toolInstalled?.singleToolConfig?.isHasTwoWayCheck || false,
      isEngagingHasEnable: toolInstalled?.singleToolConfig?.isEngagingHasEnable || false,
      isReturningHasEnable: toolInstalled?.singleToolConfig?.isReturningHasEnable || false,
      movingPunchCondition: toolInstalled?.singleToolConfig?.movingPunchCondition || ''    

    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(EditSettingSchema),
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

  // useEffect(() => {
  //   if (site) {
  //     reset(defaultValues);
  //   }
  // }, [site, reset, defaultValues]);

  const toggleCancel = () => {
    dispatch(setToolInstalledEditFormVisibility(false));
  };

  const onSubmit = async (data) => {
    try {
      data.tool = toolVal._id || null;
      data.toolType = toolType;
      data.timeOut = timeOut;
      data.engagingDuration = engagingDuration;
      data.returningDuration = returningDuration;
      data.twoWayCheckDelayTime = twoWayCheckDelayTime;
      // console.log("Setting update Data : ",machine._id,toolInstalled._id,data);
      await dispatch(updateToolInstalled(machine._id, toolInstalled._id, data));
      reset();
      setToolVal('');
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  const handleToolTypeChange = (newChange) => {
    console.log('new value=========>', newChange);
    setToolType(newChange);
    if(newChange === 'SINGLE TOOL'){
      setSingleTool(true);
      setCompositeTool(false);
    }
    else if(newChange === 'COMPOSITE TOOL'){
      setSingleTool(false);
      setCompositeTool(true);
    }
    else{
      setSingleTool(false);
      setCompositeTool(false);
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h3" sx={{ color: 'text.secondary' }}>
                  Edit Tool
                </Typography>
              </Stack>
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
                  // freeSolo
                  disabled
                  value={toolVal || null}
                  options={tools}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => option.name}
                  id="controllable-states-demo"
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setToolVal(newValue);
                    } else {
                      setToolVal('');
                    }
                  }}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} key={option.id}>
                      {option.name}
                    </Box>
                  )}
                  renderInput={(params) => <TextField {...params} label="Tool" />}
                  ChipProps={{ size: 'small' }}
                />
                
                <Autocomplete
                  // freeSolo
                  required
                  value={toolType || null}
                  options={toolTypes}
                  // isOptionEqualToValue={(option) => toolTypes.indexOf(option)}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      handleToolTypeChange(newValue);
                    } else {
                      handleToolTypeChange('');
                    }
                  }}                  id="controllable-states-demo"
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  )}
                  renderInput={(params) => (
                    <RHFTextField {...params} name="toolType" label="Tool Types" />
                  )}
                  ChipProps={{ size: 'small' }}
                >
                  {(option) => (
                    <div key={option}>
                      <span>{option}</span>
                    </div>
                  )}
                </Autocomplete>

                <RHFTextField name="offset" label="Offset" inputMode="numeric" pattern="[0-9]*"/>

                <RHFTextField name="wasteTriggerDistance" label="Waste Trigger Distance" inputMode="numeric" pattern="[0-9]*" />

                <RHFTextField name="crimpTriggerDistance" label="Crimp Trigger Distance" inputMode="numeric" pattern="[0-9]*" />

                <RHFTextField name="operations" label="Operations" inputMode="numeric" pattern="[0-9]*"/>

                </Box>

                <Box
                rowGap={0}
                columnGap={1}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(3, 1fr)',
                }}
                >
                <RHFSwitch
                  name="isApplyWaste"
                  labelPlacement="start"
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mx: 0,
                        width: 1,
                        justifyContent: 'space-between',
                        mb: 0.5,
                        color: 'text.secondary',
                      }}
                    >
                      {' '}
                      Apply Waste
                    </Typography>
                  }
                />
                <RHFSwitch
                  name="isApplyCrimp"
                  labelPlacement="start"
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mx: 0,
                        width: 1,
                        justifyContent: 'space-between',
                        mb: 0.5,
                        color: 'text.secondary',
                      }}
                    >
                      {' '}
                      Apply Crimp
                    </Typography>
                  }
                />

                <RHFSwitch
                  name="isBackToBackPunch"
                  labelPlacement="start"
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mx: 0,
                        width: 1,
                        justifyContent: 'space-between',
                        mb: 0.5,
                        color: 'text.secondary',
                      }}
                    >
                      {' '}
                      Back To Back Punch
                    </Typography>
                  }
                />
                <RHFSwitch
                  name="isManualSelect"
                  labelPlacement="start"
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mx: 0,
                        width: 1,
                        justifyContent: 'space-between',
                        mb: 0.5,
                        color: 'text.secondary',
                      }}
                    >
                      {' '}
                      Manual Select
                    </Typography>
                  }
                />
                <RHFSwitch
                  name="isAssign"
                  labelPlacement="start"
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mx: 0,
                        width: 1,
                        justifyContent: 'space-between',
                        mb: 0.5,
                        color: 'text.secondary',
                      }}
                    >
                      {' '}
                      Assign
                    </Typography>
                  }
                />
                <RHFSwitch
                  name="isActive"
                  labelPlacement="start"
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mx: 0,
                        width: 1,
                        justifyContent: 'space-between',
                        mb: 0.5,
                        color: 'text.secondary',
                      }}
                    >
                      {' '}
                      Active
                    </Typography>
                  }
                />
              </Box>
              {singleTool && <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >

                <RHFTextField name="engageSolenoidLocation" label="Engage Solenoid Location" inputMode="numeric" pattern="[0-9]*"/>

                <RHFTextField name="returnSolenoidLocation" label="Return Solenoid Location" inputMode="numeric" pattern="[0-9]*" />

                <RHFTextField name="engageOnCondition" label="Engage On Condition" inputMode="numeric" pattern="[0-9]*" />

                <RHFSwitch
                  name="engageOffCondition"
                  labelPlacement="start"
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mx: 0,
                        width: 1,
                        justifyContent: 'space-between',
                        mb: 0.5,
                        color: 'text.secondary',
                      }}
                    >
                      {' '}
                      Engage Off Condition
                    </Typography>
                  }
                />

                  <DatePicker
                    label="Time Out"
                    value={timeOut}
                    // disabled={disableInstallationDate}
                    onChange={(newValue) => setTimeOut(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />

                  <DatePicker
                    label="Engaging Duration"
                    value={engagingDuration}
                    // disabled={disableInstallationDate}
                    onChange={(newValue) => setEngagingDuration(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />

                  <DatePicker
                    label="Returning Duration"
                    value={returningDuration}
                    // disabled={disableInstallationDate}
                    onChange={(newValue) => setReturningDuration(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />

                  <DatePicker
                    label="Two-way Check Delay Time"
                    value={twoWayCheckDelayTime}
                    // disabled={disableInstallationDate}
                    onChange={(newValue) => setTwoWayCheckDelayTime(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />

                <RHFTextField name="homeProximitySensorLocation" label="Home Proximity Sensor Location" inputMode="numeric" pattern="[0-9]*" />

                <RHFTextField name="engagedProximitySensorLocation" label="Engaged Proximity Sensor Location" inputMode="numeric" pattern="[0-9]*" />

                <RHFTextField name="pressureTarget" label="Pressure Target" inputMode="numeric" pattern="[0-9]*" />

                <RHFTextField name="distanceSensorLocation" label="Distance Sensor Location" inputMode="numeric" pattern="[0-9]*" />

                <RHFTextField name="distanceSensorTarget" label="Distance Sensor Target" inputMode="numeric" pattern="[0-9]*" />

                <RHFSwitch
                  name="isHasTwoWayCheck"
                  labelPlacement="start"
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mx: 0,
                        width: 1,
                        justifyContent: 'space-between',
                        mb: 0.5,
                        color: 'text.secondary',
                      }}
                    >
                      {' '}
                      Has Two Way Check
                    </Typography>
                  }
                />


                <RHFSwitch
                  name="isEngagingHasEnable"
                  labelPlacement="start"
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mx: 0,
                        width: 1,
                        justifyContent: 'space-between',
                        mb: 0.5,
                        color: 'text.secondary',
                      }}
                    >
                      {' '}
                      Engaging Has Enabled
                    </Typography>
                  }
                />


                <RHFSwitch
                  name="isReturningHasEnable"
                  labelPlacement="start"
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mx: 0,
                        width: 1,
                        justifyContent: 'space-between',
                        mb: 0.5,
                        color: 'text.secondary',
                      }}
                    >
                      {' '}
                      Returning Has Enabled
                    </Typography>
                  }
                />

                <RHFTextField name="movingPunchCondition" label="Moving Punch Condition"/>

              </Box>}
            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
