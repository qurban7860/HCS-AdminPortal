import * as Yup from 'yup';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
// import { LoadingButton } from '@mui/lab';
import {
  Card,
  Grid,
  Stack,
  Box,
} from '@mui/material';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFDatePicker } from '../../../components/hook-form';
import { updateProject } from '../../../redux/slices/support/project/project';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { handleError } from '../../../utils/errorHandler';

// ----------------------------------------------------------------------

export const EditProjectSchema = Yup.object().shape({
  name: Yup.string().min(2).max(40).required('Name is required!'),
  startDate: Yup.mixed().label("Start Date").nullable().notRequired(),
  endDate: Yup.mixed().label("End Date").nullable().notRequired(),
  description: Yup.string().max(10000),
  customerAccess: Yup.boolean(),
  isActive: Yup.boolean(),
});


export default function ProjectEditForm() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { project } = useSelector((state) => state.project);  
  
  const defaultValues = useMemo(
    () => ({
      name: project?.name || '',
      startDate: project?.startDate || null,
      endDate: project?.endDate || null,
      description: project?.description || '',
      customerAccess: project?.customerAccess,
      isActive: project?.isActive,
    }),
    [project]);

  const methods = useForm({
    resolver: yupResolver(EditProjectSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const toggleCancel = () => {
    navigate(PATH_SETTING.projects.view(project._id));
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateProject(project._id, data));
      navigate(PATH_SETTING.projects.view(project._id));
      enqueueSnackbar('Project updated successfully!');
    } catch (error) {
      console.log(handleError(error));
      enqueueSnackbar(handleError(error), { variant: `error` });
    }
  };

  return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
                >
                  <RHFTextField name="name" label="Name" />
                  <RHFDatePicker
                    label="Start Date"
                    name="startDate"
                  />
                  <RHFDatePicker
                    label="End Date"
                    name="endDate"
                  />
                </Box>
                <RHFTextField name="description" label="Description" minRows={3} multiline />
                <Grid display="flex" alignItems="center" mt={1}>
                  <RHFSwitch name='customerAccess' label='Customer Access' />
                  <RHFSwitch name='isActive' label='Active' />
                </Grid>
              </Stack>
              <AddFormButtons settingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
  );
}
