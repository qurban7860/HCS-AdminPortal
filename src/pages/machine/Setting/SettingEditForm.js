import * as Yup from 'yup';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
// global
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFSwitch,
} from '../../../components/hook-form';
// slice
import {
  getSetting,
  setSettingEditFormVisibility,
  setSettingViewFormVisibility,
  updateSetting,
} from '../../../redux/slices/products/machineSetting';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function SettingEditForm() {
  const { setting } = useSelector((state) => state.machineSetting);
  const { machine } = useSelector((state) => state.machine);
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

  const toggleCancel = () => {
    dispatch(setSettingEditFormVisibility(false));
    dispatch(setSettingViewFormVisibility(true));
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(await updateSetting(machine._id, setting._id, data));
      await dispatch(setSettingViewFormVisibility(true));
      await dispatch(getSetting(machine._id, setting._id));
      reset();
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
              <RHFSwitch
                name="isActive"
                labelPlacement="start"
                label={
                    <Typography variant="subtitle2" 
                    sx={{mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary'}}
                    >Active</Typography>
                }
              />
            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} disabled={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
