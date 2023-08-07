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

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    setToolVal(toolInstalled.tool);
    setToolType(toolInstalled.toolType);
    dispatch(getTools());
  }, [dispatch, toolInstalled]);
  // console.log("toolInstalled : ",toolInstalled)

  const EditSettingSchema = Yup.object().shape({
    tool: Yup.string(),
    offset: Yup.string().when('$isEmpty', {
      is: false,
      then: Yup.string().test('is-number', 'Offset must be a number', value => !Number.isNaN(value)),
      otherwise: Yup.number().nullable()
    }),
    wasteTriggerDistance: Yup.number().when('$isEmpty', {
      is: false,
      then: Yup.number().typeError('Waste Trigger Distance must be a number'),
      otherwise: Yup.number().nullable()
    }),
    crimpTriggerDistance: Yup.number().when('$isEmpty', {
      is: false,
      then: Yup.number().typeError('Crimp Trigger Distance must be a number'),
      otherwise: Yup.number().nullable()
    }),
    operations: Yup.number().when('$isEmpty', {
      is: false,
      then: Yup.number().typeError('Operations must be a number'),
      otherwise: Yup.number().nullable()
    }),
    toolType: Yup.string(),
    isApplyWaste: Yup.boolean(),
    isApplyCrimp: Yup.boolean(),
    isBackToBackPunch: Yup.boolean(),
    isManualSelect: Yup.boolean(),
    isAssign: Yup.boolean(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      // tool: toolInstalled?.tool || '',
      toolName: toolInstalled?.tool?.name || '',  
      offset: toolInstalled?.offset || null,
      wasteTriggerDistance: toolInstalled?.wasteTriggerDistance || null,
      crimpTriggerDistance: toolInstalled?.crimpTriggerDistance || null,
      isApplyWaste: toolInstalled?.isApplyWaste || false,
      isApplyCrimp: toolInstalled?.isApplyCrimp || false,
      isBackToBackPunch: toolInstalled?.isBackToBackPunch || false,
      isManualSelect: toolInstalled?.isManualSelect || false,  
      isAssign: toolInstalled?.isAssign || false,
      operations: toolInstalled?.operations || null,
      toolType: toolInstalled?.toolType || '',
      isActive: toolInstalled?.isActive,
      note: toolInstalled?.note || '',
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
      // console.log("Setting update Data : ",machine._id,toolInstalled._id,data);
      await dispatch(updateToolInstalled(machine._id, toolInstalled._id, data));
      reset();
      setToolVal('');
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  const handleToolTypeChange = (event, newChange) => {
    setToolType(newChange);
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
                  onChange={handleToolTypeChange}
                  id="controllable-states-demo"
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
            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
