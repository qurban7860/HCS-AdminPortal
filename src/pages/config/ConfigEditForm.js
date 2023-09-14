import * as Yup from 'yup';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Stack, Typography } from '@mui/material';
// routes
import { PATH_SETTING } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField } from '../../components/hook-form';
// slice
import { getConfig, updateConfig } from '../../redux/slices/config/config';
// current user
import AddFormButtons from '../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function ConfigEditForm() {
  const { config } = useSelector((state) => state.config);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const EditConfigSchema = Yup.object().shape({
    name: Yup.string().required('Name is required!').min(2, 'Name must be at least 2 characters long').max(40, 'Name must not exceed 40 characters!'),
    value: Yup.string().required('Value is required!').max(70, 'Value must not exceed 70 characters!'),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: config?.name || '',
      value: config?.value || '',
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

  watch();

  const toggleCancel = () => {
    navigate(PATH_SETTING.configs.view(config._id));
  };

  const onSubmit = async (data) => {
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
              <Stack spacing={2}>
                <RHFTextField name="name" label="Name" required/>
                <RHFTextField name="value" label="Value" required/>
                <Grid display="flex" alignItems="end">
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
                </Grid>
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
    </FormProvider>
  );
}