import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo , useState, useLayoutEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { Switch ,Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link ,Autocomplete, TextField} from '@mui/material';
// global
import { CONFIG } from '../../../config-global';
// slice
import { setToolInstalledEditFormVisibility , updateToolInstalled } from '../../../redux/slices/products/toolInstalled';
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
  RHFSwitch
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function ToolsInstalledEditForm() {

  const { tools } = useSelector((state) => state.tool);
  const { initial,error, responseMessage , toolInstalledEditFormVisibility , toolsInstalled, toolInstalled, formVisibility } = useSelector((state) => state.toolInstalled);
  const [toolVal, setToolVal] = useState('');
  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    setToolVal(toolInstalled.tool);
    dispatch(getTools())
  }, [dispatch , toolInstalled]);
// console.log("toolInstalled : ",toolInstalled)

  const EditSettingSchema = Yup.object().shape({
    note: Yup.string().max(1500),
    isActive : Yup.boolean(),
  });


  const defaultValues = useMemo(
    () => ({
      // tool: toolInstalled?.tool || '',
      note: toolInstalled?.note || '',
      isActive : toolInstalled.isActive,
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

  const toggleCancel = () => 
  {
    dispatch(setToolInstalledEditFormVisibility(false));
  };

  const onSubmit = async (data) => {
    try {
      data.tool = toolVal._id || null
      // console.log("Setting update Data : ",machine._id,toolInstalled._id,data);
      await dispatch(updateToolInstalled(machine._id,toolInstalled._id,data));
      reset();
      setToolVal("");
    } catch (err) {
      enqueueSnackbar('Saving failed!');
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
                  sm: 'repeat(1, 1fr)',
                }}
              >
                <Autocomplete
                // freeSolo
                disabled
                value={ toolVal|| null}
                options={tools}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                id="controllable-states-demo"
                onChange={(event, newValue) => {
                  if(newValue){
                  setToolVal(newValue);
                  }
                  else{ 
                  setToolVal("");
                  }
                }}
                renderOption={(props, option) => (<Box component="li" {...props} key={option.id}>{option.name}</Box>)}
                renderInput={(params) => <TextField {...params}  label="Tool" />}
                ChipProps={{ size: 'small' }}
              />
                <RHFTextField name="note" label="Note*" minRows={8} multiline />
                <RHFSwitch name="isActive" labelPlacement="start" label={<Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography>} />
              </Box>
              <Box
                rowGap={5}
                columnGap={4}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(4, 1fr)',
                }}
              > 
                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                Update
                </LoadingButton>
                <Button 
                  onClick={toggleCancel}
                  variant="outlined" 
                  size="large">
                    Cancel
                </Button>
              </Box>

            </Stack>

          </Card>

        </Grid>
      </Grid>
    </FormProvider>
  );
}
