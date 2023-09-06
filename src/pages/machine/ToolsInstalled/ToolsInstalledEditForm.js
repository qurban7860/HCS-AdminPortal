import * as Yup from 'yup';
import {  useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Autocomplete,
  TextField,
  Button,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// global
import {
  setToolInstalledEditFormVisibility,
  updateToolInstalled,
} from '../../../redux/slices/products/toolInstalled';
// routes
import { useSnackbar } from '../../../components/snackbar';
import useResponsive from '../../../hooks/useResponsive';
import Iconify from '../../../components/iconify';

import FormProvider, {
  RHFTextField,
  RHFSwitch,
} from '../../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { CONFIG } from '../../../config-global'
import { checkValuesNotNull } from '../util/index'


// ----------------------------------------------------------------------

function ToolsInstalledEditForm() {
  const { toolsInstalled, toolInstalled, toolTypesObj,movingPunchConditions, engageOnConditions, engageOffConditions} = useSelector((state) => state.toolInstalled);
  console.log("toolInstalled : ", toolInstalled)
  const { activeTools } = useSelector((state) => state.tool);
  const { machine } = useSelector((state) => state.machine);

  const [compositToolVal, setCompositToolVal] = useState([]);
  console.log("compositToolVal : ",compositToolVal)
  const [compositToolNumber, setCompositToolNumber] = useState(1);

  // const [toolsVal, setToolsVal] = useState([]);

  const dispatch = useDispatch();
  const isMobile = useResponsive('down', 'sm');
  const { enqueueSnackbar } = useSnackbar();

  const EditSettingSchema = Yup.object().shape({
    tool: Yup.object().shape({
      name: Yup.string()
    }).nullable().required().label('Tool'),
    offset: Yup.number()
    .typeError('Offset must be a number')
    .transform((value, originalValue) => {
      if (typeof originalValue !== 'string') {
        return undefined; // Skip transformation for non-string values
      }
      if (originalValue.trim() === '') {
        return undefined;
      }
      return parseFloat(value);
    })
    .test('no-spaces', 'Offset cannot have spaces', value => !(value && value.toString().includes(' '))),

    wasteTriggerDistance: Yup.number()
    .typeError('Waste Trigger Distance must be a number')
    .transform((value, originalValue) => {
      if (typeof originalValue !== 'string') {
        return undefined; // Skip transformation for non-string values
      }
      if (originalValue.trim() === '') {
        return undefined;
      }
      return parseFloat(value);
    })
    .test('no-spaces', 'Waste Trigger Distance cannot have spaces', value => !(value && value.toString().includes(' '))),

    crimpTriggerDistance: Yup.number()
    .typeError('Crimp Trigger Distance must be a number')
    .transform((value, originalValue) => {
      if (typeof originalValue !== 'string') {
        return undefined; // Skip transformation for non-string values
      }
      if (originalValue.trim() === '') {
        return undefined;
      }
      return parseFloat(value);
    })
    .test('no-spaces', 'Crimp Trigger Distance cannot have spaces', value => !(value && value.toString().includes(' '))),

    operations: Yup.number()
  .typeError('Operations must be a number')
  .transform((value, originalValue) => {
    if (typeof originalValue !== 'string') {
      return undefined; // Skip transformation for non-string values
    }
    if (originalValue.trim() === '') {
      return undefined;
    }
    return parseFloat(value);
  })
  .test('no-spaces', 'Operations cannot have spaces', value =>
    !(value && value.toString().includes(' '))
  ),
    toolType: Yup.object().required().test('composit-tool-validation', 'Engage Instrctuion or Disengage Instrctuion is required!', (value) =>{
      if(value?.name === 'COMPOSIT TOOL' && (compositToolVal.length < 1 || !(compositToolVal.some(checkValuesNotNull)))){
        return false;
      }
      return true;
    }).nullable().label('Tool Type'),
    isApplyWaste: Yup.boolean(),
    isApplyCrimp: Yup.boolean(),
    isBackToBackPunch: Yup.boolean(),
    isManualSelect: Yup.boolean(),
    isAssign: Yup.boolean(),
    isActive: Yup.boolean(),
    // --------------------------------------SINGLE TOOL CONFIGURATION-------------------------------------
    engageSolenoidLocation: Yup.number()
      .typeError('Engage Solenoid Location must be a number')
      .transform((value, originalValue) => {
        if (typeof originalValue !== 'string') {
          return undefined; // Skip transformation for non-string values
        }
        if (originalValue.trim() === '') {
          return undefined;
        }
        return parseFloat(value);
      }).test('no-spaces', 'Engage Solenoid Location cannot have spaces', value => !(value && value.toString().includes(' '))),

    returnSolenoidLocation: Yup.number()
      .typeError('Return Solenoid Location must be a number')
      .transform((value, originalValue) => {
        if (typeof originalValue !== 'string') {
          return undefined; // Skip transformation for non-string values
        }
        if (originalValue.trim() === '') {
          return undefined;
        }
        return parseFloat(value);
      }).test('no-spaces', 'Return Solenoid Location cannot have spaces', value => !(value && value.toString().includes(' '))),

    // engageOnCondition: Yup.object().shape({
    //   label: Yup.string()
    // }).nullable().label('Engage On Condition'),
    // engageOffCondition: Yup.object().shape({
    //   label: Yup.string()
    // }).nullable().label('Engage Off Condition'),  
    homeProximitySensorLocation: Yup.number()
      .typeError('Home Proximity Sensor Location must be a number')
      .transform((value, originalValue) => {
        if (typeof originalValue !== 'string') {
          return undefined; // Skip transformation for non-string values
        }
        if (originalValue.trim() === '') {
          return undefined;
        }
        return parseFloat(value);
      }).test('no-spaces', 'Home Proximity Sensor Location cannot have spaces', value => !(value && value.toString().includes(' '))),
    engagedProximitySensorLocation: Yup.number()
      .typeError('Engaged Proximity Sensor Location must be a number')
      .transform((value, originalValue) => {
        if (typeof originalValue !== 'string') {
          return undefined; // Skip transformation for non-string values
        }
        if (originalValue.trim() === '') {
          return undefined;
        }
        return parseFloat(value);
      }).test('no-spaces', 'Engaged Proximity Sensor Location cannot have spaces', value => !(value && value.toString().includes(' '))),
    pressureTarget: Yup.number()
      .typeError('Pressure Target must be a number')
      .transform((value, originalValue) => {
        if (typeof originalValue !== 'string') {
          return undefined; // Skip transformation for non-string values
        }
        if (originalValue.trim() === '') {
          return undefined;
        }
        return parseFloat(value);
      }).test('no-spaces', 'Pressure Target cannot have spaces', value => !(value && value.toString().includes(' '))),
    distanceSensorLocation: Yup.number()
      .typeError('Distance Sensor Location must be a number')
      .transform((value, originalValue) => {
        if (typeof originalValue !== 'string') {
          return undefined; // Skip transformation for non-string values
        }
        if (originalValue.trim() === '') {
          return undefined;
        }
        return parseFloat(value);
      }).test('no-spaces', 'Distance Sensor Location cannot have spaces', value => !(value && value.toString().includes(' '))),
      distanceSensorTarget: Yup.number()
      .typeError('Distance Sensor Target must be a number')
      .transform((value, originalValue) => {
        if (typeof originalValue !== 'string') {
          return undefined; // Skip transformation for non-string values
        }
        if (originalValue.trim() === '') {
          return undefined;
        }
        return parseFloat(value);
      })
      .test('no-spaces', 'Distance Sensor Target cannot have spaces', value => !(value && value.toString().includes(' '))), 
      engagingDuration: Yup.number()
    .typeError('Engaging Duration must be a number')
      .transform((value, originalValue) => {
      if (originalValue.trim() === '') return undefined;
      return parseFloat(value);
      }).test('no-spaces', 'Engaging Duration cannot have spaces', value => !(value && value.toString().includes(' '))),
    returningDuration: Yup.number()
    .typeError('Returning Duration must be a number')
      .transform((value, originalValue) => {
      if (originalValue.trim() === '') return undefined;
      return parseFloat(value);
      }).test('no-spaces', 'Returning Duration cannot have spaces', value => !(value && value.toString().includes(' '))),
    twoWayCheckDelayTime: Yup.number()
    .typeError('Two-Way Check Delay Time must be a number')
      .transform((value, originalValue) => {
      if (originalValue.trim() === '') return undefined;
      return parseFloat(value);
      }).test('no-spaces', 'Two Way Check Delay Time cannot have spaces', value => !(value && value.toString().includes(' '))),   
    isHasTwoWayCheck: Yup.boolean(),
    isEngagingHasEnable: Yup.boolean(),
    isReturningHasEnable: Yup.boolean(),
    movingPunchCondition: Yup.object().shape({
      label: Yup.string()
    }).nullable().label('Moving Punch Condition'),
    // -------------------------------- composite Tool Config --------------------------------
    // engageInstruction: Yup.object(),
    // disengageInstruction: Yup.object()
  });

  const methods = useForm({
    resolver: yupResolver(EditSettingSchema),
    defaultValues:{
      tool: toolInstalled?.tool || null,
      offset: toolInstalled?.offset || '',
      isApplyWaste: toolInstalled?.isApplyWaste ,
      wasteTriggerDistance: toolInstalled?.wasteTriggerDistance || '',
      isApplyCrimp: toolInstalled?.isApplyCrimp ,
      crimpTriggerDistance: toolInstalled?.crimpTriggerDistance || '',
      isBackToBackPunch: toolInstalled?.isBackToBackPunch ,
      isManualSelect: toolInstalled?.isManualSelect ,
      isAssign: toolInstalled?.isAssign,
      operations: toolInstalled?.operations || '',
      toolType: { name: 'GENERIC TOOL'} ,

      // singleToolConfig {label: 'PASS'} {label: 'NO CONDITION'}
      engageSolenoidLocation: toolInstalled?.singleToolConfig?.engageSolenoidLocation || '',
      returnSolenoidLocation: toolInstalled?.singleToolConfig?.returnSolenoidLocation || '',
      engageOnCondition: null,
      engageOffCondition: null,
      timeOut: toolInstalled?.singleToolConfig?.timeOut || null,
      engagingDuration: toolInstalled?.singleToolConfig?.engagingDuration || '',
      returningDuration: toolInstalled?.singleToolConfig?.returningDuration || '',
      twoWayCheckDelayTime: toolInstalled?.singleToolConfig?.twoWayCheckDelayTime || '',
      homeProximitySensorLocation: toolInstalled?.singleToolConfig?.homeProximitySensorLocation || '',
      engagedProximitySensorLocation: toolInstalled?.singleToolConfig?.engagedProximitySensorLocation || '',
      pressureTarget: toolInstalled?.singleToolConfig?.pressureTarget ||'',
      distanceSensorLocation: toolInstalled?.singleToolConfig?.distanceSensorLocation ||'',
      distanceSensorTarget: toolInstalled?.singleToolConfig?.distanceSensorTarget ||'',
      isHasTwoWayCheck: toolInstalled?.singleToolConfig?.isHasTwoWayCheck ,
      isEngagingHasEnable: toolInstalled?.singleToolConfig?.isEngagingHasEnable ,
      isReturningHasEnable: toolInstalled?.singleToolConfig?.isReturningHasEnable ,
      movingPunchCondition: null,

      // compositeToolConfig  
      // engageInstruction: toolInstalled?.compositeToolConfig?.engageInstruction || '',
      // disengageInstruction: toolInstalled?.compositeToolConfig?.disengageInstruction || '',

      isActive: toolInstalled?.isActive,
    }
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    control,
  } = methods

  const { 
    tool, 
    toolType,
    offset,
    engageOnCondition, 
    engageOffCondition, 
    movingPunchCondition, 
    timeOut,
    engagingDuration, 
    returningDuration, 
    twoWayCheckDelayTime, 
    wasteTriggerDistance,
    crimpTriggerDistance,
    operations,
    engageSolenoidLocation,
    returnSolenoidLocation,
    homeProximitySensorLocation,
    engagedProximitySensorLocation,
    pressureTarget,
    distanceSensorLocation,
    distanceSensorTarget
    } = watch();

  useEffect(() => {
    if(toolInstalled?.singleToolConfig?.movingPunchCondition){
      setValue('movingPunchCondition',{name: toolInstalled?.singleToolConfig?.movingPunchCondition })
    }else{
      setValue('movingPunchCondition',movingPunchConditions[0])
    }if(toolInstalled?.singleToolConfig?.engageOnCondition){
      setValue('engageOnCondition',{name: toolInstalled?.singleToolConfig?.engageOnCondition})
    }else{
      setValue('engageOnCondition',engageOnConditions[1])
    }
    if(toolInstalled?.singleToolConfig?.engageOffCondition){
      setValue('engageOffCondition',{name: toolInstalled?.singleToolConfig?.engageOffCondition})
    }else{
      setValue('engageOffCondition',engageOffConditions[0])
    }
    setValue('toolType',{name: toolInstalled?.toolType})
    setCompositToolNumber(toolInstalled?.compositeToolConfig.length)
    const comToolVal = toolInstalled?.compositeToolConfig.map((value) => ({engage: value.engageInstruction, disengage: value.disengageInstruction}))
    setCompositToolVal(comToolVal || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolInstalled]);

  const toggleCancel = () => { dispatch(setToolInstalledEditFormVisibility(false));};
  const handleCompositToolNumberIncrease = () => { setCompositToolNumber(compositToolNumber + 1); };

  const onSubmit = async (data) => {
    data.offset= offset
    data.operations= operations
    data.engagingDuration = engagingDuration
    data.returningDuration = returningDuration
    data.twoWayCheckDelayTime = twoWayCheckDelayTime
    data.wasteTriggerDistance = wasteTriggerDistance
    data.crimpTriggerDistance = crimpTriggerDistance
    data.engageSolenoidLocation = engageSolenoidLocation
    data.returnSolenoidLocation = returnSolenoidLocation
    data.homeProximitySensorLocation = homeProximitySensorLocation
    data.engagedProximitySensorLocation = engagedProximitySensorLocation
    data.pressureTarget = pressureTarget
    data.distanceSensorLocation = distanceSensorLocation
    data.distanceSensorTarget = distanceSensorTarget
    data.compositeToolConfig = compositToolVal;
    console.log("tool install edit data : ", data);
    try {
      data.toolType = toolType;
      await dispatch(updateToolInstalled(machine._id, toolInstalled._id, data));
      reset();
      // setToolVal('');
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };


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
                  <Controller
                    name="tool"
                    control={control}
                    defaultValue={tool || null}
                    render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        disabled
                        options={activeTools}
                        getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                        )}
                        onChange={(event, value) => field.onChange(value)}
                        id="combo-box-demo"
                        renderInput={(params) => (
                        <TextField 
                          {...params} 
                          name="tool"
                          id="tool"
                          label="Tool*"  
                          error={!!error}
                          helperText={error?.message} 
                          inputRef={ref} 
                        />
                        )}
                          ChipProps={{ size: 'small' }}
                      />
                      )}
                  />

                <RHFTextField name="offset" label="Offset" inputMode="numeric" pattern="[0-9]*"/>

                {/* <RHFTextField name="toolType" label="Tool Type" /> */}

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

                <RHFTextField name="wasteTriggerDistance" label="Waste Trigger Distance" inputMode="numeric" pattern="[0-9]*" />

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
                <Controller
                  name="toolType"
                  control={control}
                  defaultValue={toolType || null }
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                  <Autocomplete
                    {...field} 
                    options={toolTypesObj}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    isOptionEqualToValue={(option, value) => option.name === value.name}
                    onChange={(event, value) => field.onChange(value)}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        name="toolType" 
                        id="toolType" 
                        label="Tool Types" 
                        error={!!error}
                        helperText={error?.message} 
                        inputRef={ref}  
                      />
                    )}
                    disableClearable
                  />
                  )}
                />
                {toolType?.name === 'COMPOSIT TOOL' && (  
                  <Grid display="flex" justifyContent="flex-end">
                    <Button
                      onClick={ handleCompositToolNumberIncrease }
                      fullWidth={ isMobile }
                      disabled={ compositToolNumber >= CONFIG.COMPOSITE_TOOL_CONFIG_MAX_LENGTH }
                      variant="contained"
                      color='primary'
                      startIcon={<Iconify icon="eva:plus-fill" />}
                      sx={{
                        // width: {xs: '100%' ,md: '50%'},
                        // mb: { xs: 0, md: 2 },
                        // my: { xs: 1 },
                        ...(isMobile && { width: '100%' }),
                        // opacity: isCustomer ? 0 : 1,
                        // display: isMobile ? 'none' : 'flex',
                      }}
                    >Add more
                    </Button>
                  </Grid>    
                )}
              </Box>
              {toolType.name === 'SINGLE TOOL' && 
              <>
              <Box
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

                <Controller
                    name="engageOnCondition"
                    control={control}
                    defaultValue={engageOnCondition || null}
                    render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        options={engageOnConditions}
                        getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                        onChange={(event, value) => field.onChange(value)}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        id="combo-box-demo"
                        renderInput={(params) => (
                        <TextField 
                          {...params} 
                          name="engageOnCondition"
                          id="engageOnCondition"
                          label="Engage On Condition*"  
                          error={!!error}
                          helperText={error?.message} 
                          inputRef={ref} 
                        />
                        )}
                          disableClearable
                      />
                      )}
                  />

                  <Controller
                    name="engageOffCondition"
                    control={control}
                    defaultValue={engageOffCondition || null}
                    render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        options={engageOffConditions}
                        getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        onChange={(event, value) => field.onChange(value)}
                        id="combo-box-demo"
                        renderInput={(params) => (
                        <TextField 
                          {...params} 
                          name="engageOffCondition"
                          id="engageOffCondition"
                          label="Engage Off Condition*"  
                          error={!!error}
                          helperText={error?.message} 
                          inputRef={ref} 
                        />
                        )}
                          disableClearable
                      />
                      )}
                  />
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
                  <DatePicker
                    label="Time Out"
                    value={timeOut}
                    // disabled={disableInstallationDate}
                    onChange={(newValue) => setValue('timeOut',newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
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
                  <RHFTextField label="Engaging Duration" name="engagingDuration" />

                  <RHFTextField label="Returning Duration" name="returningDuration" />
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
                  <RHFTextField label="Two-way Check Delay Time" name="twoWayCheckDelayTime" />
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
                <RHFTextField name="homeProximitySensorLocation" label="Home Proximity Sensor Location" inputMode="numeric" pattern="[0-9]*" />

                <RHFTextField name="engagedProximitySensorLocation" label="Engaged Proximity Sensor Location" inputMode="numeric" pattern="[0-9]*" />
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
                <RHFTextField name="pressureTarget" label="Pressure Target" inputMode="numeric" pattern="[0-9]*" />
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
                <RHFTextField name="distanceSensorLocation" label="Distance Sensor Location" inputMode="numeric" pattern="[0-9]*" />

                <RHFTextField name="distanceSensorTarget" label="Distance Sensor Target" inputMode="numeric" pattern="[0-9]*" />

                </Box>
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
                <Controller
                    name="movingPunchCondition"
                    control={control}
                    defaultValue={movingPunchCondition || null}
                    render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                      <Autocomplete
                        {...field}
                        options={movingPunchConditions}
                        onChange={(event, value) => field.onChange(value)}
                        getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        id="combo-box-demo"
                        renderInput={(params) => (
                        <TextField 
                          {...params} 
                          name="movingPunchCondition"
                          id="movingPunchCondition"
                          label="Moving Punch Condition*"  
                          error={!!error}
                          helperText={error?.message} 
                          inputRef={ref} 
                        />
                        )}
                          disableClearable
                      />
                      )}
                  />

              </Box>
              </>}

              { toolType?.name === 'COMPOSIT TOOL' && Array.from({ length: compositToolNumber }).map((_, index) => (
                    <Box
                      rowGap={2}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                      }}
                      key={index}
                    >
                          <Autocomplete
                            value={compositToolVal[index]?.engage || null}
                            id={`engageInstruction_${index}`}
                            options={toolsInstalled}
                            getOptionLabel={(option) => `${option?.tool?.name ? option?.tool?.name : ''}`}
                            isOptionEqualToValue={(option, value) => option?.tool?._id === value?.tool?._id}
                            onChange={(event, value) => {
                              setCompositToolVal((prevVal) => {
                                const updatedVal = [...prevVal];
                                updatedVal[index] = { engage: value, disengage: updatedVal[index]?.disengage || null };
                                return updatedVal;
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={`Engage Instruction ${index + 1}`}
                                placeholder="Search"
                              />
                            )}
                          />

                          <Autocomplete
                            value={compositToolVal[index]?.disengage || null}
                            id={`disengageInstruction_${index}`}
                            options={toolsInstalled}
                            getOptionLabel={(option) => `${option?.tool?.name ? option?.tool?.name : ''}`}
                            isOptionEqualToValue={(option, value) => option?.tool?._id === value?.tool?._id}
                            onChange={(event, value) => {
                              setCompositToolVal((prevVal) => {
                                const updatedVal = [...prevVal];
                                updatedVal[index] = { disengage: value, engage: updatedVal[index]?.engage || null };
                                return updatedVal;
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={`Disengage Instruction ${index + 1}`}
                                placeholder="Search"
                              />
                            )}
                          />
                  </Box>)
                  )}
              
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

            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default memo(ToolsInstalledEditForm)