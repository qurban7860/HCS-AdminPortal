import * as Yup from 'yup';
import { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Container, Card, Grid, Stack } from '@mui/material';
// components
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { PATH_SETTING } from '../../../routes/paths';
import { useSnackbar } from '../../../components/snackbar';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFTextField, RHFSwitch, RHFEditor, RHFAutocomplete, RHFDatePicker} from '../../../components/hook-form';
import { postRelease, patchRelease, getRelease, resetRelease } from '../../../redux/slices/support/release/release';
import { getActiveProjects, resetActiveProjects } from '../../../redux/slices/support/project/project';
import { handleError } from '../../../utils/errorHandler';

export default function ReleaseForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { release } = useSelector((state) => state.release);
  const { activeProjects } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(getActiveProjects());
    return () => {
      dispatch(resetActiveProjects());
    };
  }, [dispatch]);

  const defaultValues = useMemo(
    () => ({
      project: id && release?.project || null,
      name: id && release?.name || '',
      status: id && release?.status || 'To Do',
      releaseDate: id && release?.releaseDate || null,
      description: id && release?.description || '',
      isActive: id ? release?.isActive : true,
      createdAt: id && release?.createdAt || '',
    }),
    [id, release]
  );

  const ReleaseSchema = Yup.object().shape({
  project: Yup.object().required().label('Project').nullable(),
  name: Yup.string().min(2).max(50).required('Name is required!'),
  releaseDate: Yup.mixed().label("Release Date").nullable().notRequired(),
  description: Yup.string().max(5000),
  isActive: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(ReleaseSchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    if (id) {
      dispatch(getRelease(id));
    }
    return () => {
      dispatch(resetRelease());
    }
  }, [dispatch, id])

  useEffect(() => {
    if (id && release) {
      reset(defaultValues);
    }
  }, [id, release, defaultValues, reset]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await dispatch(patchRelease(id, data));
        enqueueSnackbar('Release Updated Successfully!');
        navigate(PATH_SETTING.projectReleases.view(id));
      } else {
        await dispatch(postRelease(data));
        enqueueSnackbar('Release Added Successfully!');
        navigate(PATH_SETTING.projectReleases.root);
      }
      reset();
    } catch (error) {
      enqueueSnackbar(handleError(error) || 'release save failed!', { variant: 'error' });
      console.error(error);
    }
  };

  const toggleCancel = async () => {
    dispatch(resetRelease())
    await navigate(PATH_SETTING.projectReleases.root);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={release?.name || 'New Release'} />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
                >
                  <RHFAutocomplete 
                    name="project" 
                    label="Project*" 
                    options={activeProjects} 
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                  />
                  <RHFTextField name="name" label="Name*" />
                  <RHFDatePicker
                    label="Release Date"
                    name="releaseDate"
                  />
                </Box>
                <RHFEditor name="description" label="Description" minRows={3} multiline />
                <Grid display="flex" alignItems="center">
                  <RHFSwitch name="isActive" label="Active" />
                </Grid>
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
