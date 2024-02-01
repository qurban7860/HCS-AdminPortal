// import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Box,
  Card,
  Grid,
  Typography,
} from '@mui/material';
// routes
import { PATH_SETTING } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFAutocomplete, RHFSwitch, RHFTextField } from '../../../../components/hook-form';
// slice
import { addConfig, ConfigTypes } from '../../../../redux/slices/config/config';
// current user
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
// ----------------------------------------------------------------------

export default function ConfigAddForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewConfigSchema = Yup.object().shape({
    name: Yup.string().required('Name is required!').min(2, 'Name must be at least 2 characters long').max(40, 'Name must not exceed 40 characters!'),
    type: Yup.string().nullable().required('Type is required!'),
    value: Yup.string().required('Value is required!').max(70, 'Value must not exceed 70 characters!'),
    notes: Yup.string().max(5000),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      type: null,
      value: '',
      notes: '',
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewConfigSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    // control,
    // setValue,
    handleSubmit,
    formState: { isSubmitting },
    // trigger,
  } = methods;

  const { type } = watch();

  const onSubmit = async (data) => {
    data.notes = data?.notes.trim();
    try {
      const response = await dispatch(addConfig(data));
      reset();
      navigate(PATH_SETTING.configs.view(response.data.Config._id));
    } catch (error) {
      if (error.Message) {
        enqueueSnackbar(error.Message, { variant: `error` });
      } else if (error.message) {
        enqueueSnackbar(error.message, { variant: `error` });
      } else {
        enqueueSnackbar('Something went wrong!', { variant: `error` });
      }
      console.log('Error:', error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SETTING.configs.list);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
       <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Box sx={{marginTop:2}}  rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)',}}>
                <RHFTextField name="name" label="Name"/>
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

                <RHFTextField name="value" label="Value"/>
              </Box>
              <Box sx={{marginTop:2}}  rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)',}}>
                <RHFTextField name='notes' label='Notes' minRows={5} multiline/>
                <RHFSwitch name="isActive" label="Active" />
              </Box>
              <AddFormButtons settingPage isActive isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
    </FormProvider>
  );
}
