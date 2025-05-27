// import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
// import { LoadingButton } from '@mui/lab';
import {
  Card,
  Grid,
  Stack,
  Container,
  Box,
} from '@mui/material';
// routes
import { PATH_SUPPORT } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFEditor } from '../../../components/hook-form';
import { updateProject } from '../../../redux/slices/support/project/project';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import FormHeading from '../../../components/DocumentForms/FormHeading';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { FORMLABELS } from '../../../constants/default-constants';
import { FORMLABELS as formLABELS } from '../../../constants/document-constants';
import { handleError } from '../../../utils/errorHandler';

// ----------------------------------------------------------------------

export const EditProjectSchema = Yup.object().shape({
  key: Yup.string().min(2).max(5).required('Key is required!'),
  title: Yup.string().min(2).max(40).required('Title is required!'),
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
      key: project?.key || '',
      title: project?.title || '',
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
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // useEffect(() => {
  //   reset(defaultValues);
  // }, [reset, defaultValues]);


  const toggleCancel = () => {
    navigate(PATH_SUPPORT.projects.view(project._id));
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateProject(project._id, data));
      navigate(PATH_SUPPORT.projects.view(project._id));
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
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(1, 3fr 10fr)' }}
                >
                  <RHFTextField name="key" label="Key" />
                  <RHFTextField name="title" label="Title" />
                </Box>
                <RHFEditor name="description" label="Description" minRows={3} multiline />
                <Grid display='flex' alignItems="center" mt={1} >
                  <RHFSwitch name='customerAccess' label='Customer Access' />
                </Grid>
                <Grid display='flex' alignItems="center" mt={1} >
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
