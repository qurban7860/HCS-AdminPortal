import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, Stack, Typography, Autocomplete, TextField } from '@mui/material';
// slice
import {
  setToolInstalledEditFormVisibility,
  setToolInstalledFormVisibility,
  updateToolInstalled,
  addToolInstalled,
  getToolsInstalled,
  getToolInstalled,
} from '../../../redux/slices/products/toolInstalled';
import { getActiveTools } from '../../../redux/slices/products/tools';
// components
import { useSnackbar } from '../../../components/snackbar';
// assets
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch,
} from '../../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function ToolsInstalledAddForm() {

  const { activeTools } = useSelector((state) => state.tool);
  const {
    toolTypes,
    toolsInstalled,
  } = useSelector((state) => state.toolInstalled);
  const [toolVal, setToolVal] = useState('');
  const [toolType, setToolType] = useState('');
  const [toolsVal, setToolsVal] = useState([]);
  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  useLayoutEffect(() => {
    dispatch(getActiveTools());
    dispatch(getToolsInstalled);
  }, [dispatch, machine]);

  useLayoutEffect(() => {
    const filterTool = [];
    toolsInstalled.map((toolInstalled) => filterTool.push(toolInstalled?.tool?._id));
    const filteredTool = activeTools.filter((item) => !filterTool.includes(item._id));
    filteredTool.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    // console.log("filteredTool: ", filteredTool)
    setToolsVal(filteredTool);
  }, [activeTools, toolsInstalled, machine]);

  const AddSettingSchema = Yup.object().shape({
    tool: Yup.string(),

    offset: Yup.number()
    .typeError('Offset must be a number')
    .transform((value, originalValue) => {
    if (originalValue.trim() === '') return undefined;
    return parseFloat(value);
    })
    .test('no-spaces', 'Offset cannot have spaces', value => !(value && value.toString().includes(' '))),

    wasteTriggerDistance: Yup.number()
    .typeError('Waste Trigger Distance must be a number')
    .transform((value, originalValue) => {
    if (originalValue.trim() === '') return undefined;
    return parseFloat(value);
    })
    .test('no-spaces', 'Waste Trigger Distance cannot have spaces', value => !(value && value.toString().includes(' '))),

    crimpTriggerDistance: Yup.number()
    .typeError('Crimp Trigger Distance must be a number')
    .transform((value, originalValue) => {
    if (originalValue.trim() === '') return undefined;
    return parseFloat(value);
    })
    .test('no-spaces', 'Crimp Trigger Distance cannot have spaces', value => !(value && value.toString().includes(' '))),

    operations: Yup.number()
    .typeError('Operations must be a number')
    .transform((value, originalValue) => {
    if (originalValue.trim() === '') return undefined;
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
  });

  const toggleCancel = () => {
    dispatch(setToolInstalledFormVisibility(false));
  };

  const defaultValues = useMemo(
    () => ({
      tool: '',
      offset: null,
      wasteTriggerDistance: null,
      crimpTriggerDistance: null,
      operations: null,
      toolType: '',
      isApplyWaste: false,
      isApplyCrimp: false,
      isBackToBackPunch: false,
      isManualSelect: false,
      isAssign: false,
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddSettingSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      if (toolVal !== '') {
        data.tool = toolVal._id;
      }
      if (toolType) {
        data.toolType = toolType;
      }
      // console.log("Data", data);
      await dispatch(addToolInstalled(machine._id, data));
      reset();
      setToolVal('');
      dispatch(setToolInstalledFormVisibility(false));
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
                  New Tool
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
                  required
                  value={toolVal || null}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  options={toolsVal}
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
                  renderInput={(params) => <TextField {...params} label="Tool" required />}
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

                {/* <RHFTextField name="toolType" label="Tool Type" /> */}

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
