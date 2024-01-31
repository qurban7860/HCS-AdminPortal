import * as Yup from 'yup';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid } from '@mui/material';
// routes
import { PATH_SETTING } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFAutocomplete, RHFSwitch, RHFTextField } from '../../components/hook-form';
// slice
import { getConfig, updateConfig, ConfigTypes } from '../../redux/slices/config/config';
// current user
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function ConfigEditForm() {
  const { config } = useSelector((state) => state.config);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const EditConfigSchema = Yup.object().shape({
    name: Yup.string().required('Name is required!').min(2, 'Name must be at least 2 characters long').max(40, 'Name must not exceed 40 characters!'),
    type: Yup.string().nullable().required('Type is required!'),
    value: Yup.string().required('Value is required!').max(70, 'Value must not exceed 70 characters!'),
    notes: Yup.string().max(5000),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: config?.name || '',
      type: config?.type || '',
      value: config?.value || '',
      notes: config?.notes || '',
      isActive: config?.isActive || false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(EditConfigSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const {type} = watch();

  const toggleCancel = () => {
    navigate(PATH_SETTING.configs.view(config._id));
  };

  const onSubmit = async (data) => {
    data.notes = data?.notes.trim();
    try {
      await dispatch(updateConfig(data, config._id));
      dispatch(getConfig(config._id));
      enqueueSnackbar('Config updated Successfully!');
      navigate(PATH_SETTING.configs.view(config._id));
      reset();
    } catch (err) {
      enqueueSnackbar('Config Updating failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
       <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Box sx={{marginTop:2}}  rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)',}}>
                <RHFTextField name="name" label="Name*"/>
              </Box>
              <Box rowGap={2} sx={{marginTop:2}} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)',}}>
                <RHFAutocomplete
                    // multiple 
                    value={type}
                    name="type"
                    label="Type*"
                    options={ConfigTypes}
                    isOptionEqualToValue={(option, value) => option === value}
                    getOptionLabel={(option) => option}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>{option}</li>
                    )}
                  />

                <RHFTextField name="value" label="Value*"/>
              </Box>
              <Box sx={{marginTop:2}}  rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)',}}>
                <RHFTextField name='notes' label='Notes' minRows={5} multiline/>
                <RHFSwitch name="isActive" labelPlacement="start" label="Active" />
              </Box>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
    </FormProvider>
  );
}