import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Stack } from '@mui/material';
// routes
import { PATH_SETTING } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField } from '../../../../components/hook-form';
// slice
import { getModules, updateModule } from '../../../../redux/slices/module/module';
// current user
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';

export default function ModuleEditForm() {
  const { module } = useSelector((state) => state.module);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();


  const EditModuleSchema = Yup.object().shape({
    name: Yup.string().required('Name is required!').max(40, 'Name must not exceed 40 characters!'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(EditModuleSchema),
    defaultValues:module,
  });
  
  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  watch();

  const toggleCancel = () => {
    navigate(PATH_SETTING.modules.view(module._id));
  };

  const onSubmit = async (data) => {
    try { 
     await dispatch(updateModule(data, module._id));
      dispatch(getModules(module._id));
      enqueueSnackbar('Module updated Successfully!');
      navigate(PATH_SETTING.modules.view(module._id));
      reset();
    } catch (err) {
      enqueueSnackbar('Module Updating failed!', { variant: `error` });
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
                <RHFTextField name="description" label="Description" minRows={8} multiline />
                <Grid display="flex" alignItems="end">
                  <RHFSwitch name="isActive" label="Active" />
                </Grid>
              </Stack>
              <AddFormButtons settingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
    </FormProvider>
  );
}