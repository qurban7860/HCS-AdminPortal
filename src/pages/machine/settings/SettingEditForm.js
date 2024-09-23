import * as Yup from 'yup';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// global
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
// slice
import { updateSetting } from '../../../redux/slices/products/machineSetting';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function SettingEditForm() {
  const { setting } = useSelector((state) => state.machineSetting);
  const { machineId, id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const defaultValues = useMemo(
    () => ({
      techParamCategory: setting.techParam.category.name || '',
      techParam: setting.techParam.name,
      techParamValue: setting?.techParamValue || '',
      isActive: setting?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setting]
  );

  const EditSettingSchema = Yup.object().shape({
    techParamValue: Yup.string().max(50).required().label('Technical Parameter Value'),
    isActive: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(EditSettingSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  
  const onSubmit = async (data) => {
    try {
      await dispatch( updateSetting(machineId, id, data));
      await navigate(PATH_MACHINE.machines.settings.view( machineId, id ));
      reset();
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };
  
  const toggleCancel = () => navigate(PATH_MACHINE.machines.settings.view( machineId, id ));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box
                rowGap={3}
                columnGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="techParamCategory" label="Category" disabled />
                <RHFTextField name="techParam" label="Technical Parameters" disabled/>
              </Box>
              <RHFTextField name="techParamValue" label="Technical Parameter Value" />
              <RHFSwitch name="isActive" label="Active" />
            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} disabled={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
