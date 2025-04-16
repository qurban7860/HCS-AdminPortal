import { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Container, Card, Grid, Stack, InputAdornment } from '@mui/material';
// components
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { PATH_SUPPORT } from '../../routes/paths';
import { useSnackbar } from '../../components/snackbar';
// import { TicketCollectionSchema } from '../utils/constant';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFTextField, RHFSwitch, RHFColorPicker } from '../../components/hook-form';
import { postJob, patchJob, getJob, resetJob } from '../../redux/slices/jobs/jobs';
import Iconify from '../../components/iconify';
import { handleError } from '../../utils/errorHandler';

export default function JobForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { Job } = useSelector((state) => state.Jobs);

  const defaultValues = useMemo(
    () => ({
      name: id && Job?.name || '',
      icon: id && Job?.icon || '',
      color: id && Job?.color || '',
      slug: id && Job?.slug || '',
      description: id && Job?.description || '',
      displayOrderNo: id && Job?.displayOrderNo || '',
      isDefault: id && Job?.isDefault || false,
      isActive: id ? Job?.isActive : true,
      createdAt: id && Job?.createdAt || '',
    }),
    [id, Job]
  );

  const methods = useForm({
    // resolver: yupResolver(TicketCollectionSchema),
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting }
  } = methods;

  const { icon, color } = watch();

  useEffect(() => {
    if (id) {
      dispatch(getJob(id));
    }
    return () => {
      dispatch(resetJob());
    }
  }, [dispatch, id])

  useEffect(() => {
    if (id && Job) {
      reset(defaultValues);
    }
  }, [id, Job, defaultValues, reset]);

  useEffect(() => {
  }, [color]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await dispatch(patchJob(id, data));
        enqueueSnackbar('Issue Type Updated Successfully!');
        navigate(PATH_SUPPORT.Settings.Jobs.view(id));
      } else {
        await dispatch(postJob(data));
        enqueueSnackbar('Issue Type Added Successfully!');
        navigate(PATH_SUPPORT.Settings.Jobs.root);
      }
      reset();
    } catch (error) {
      enqueueSnackbar(handleError(error) || 'IssueType save failed!', { variant: 'error' });
      console.error(error);
    }
  };

  const toggleCancel = async () => {
    dispatch(resetJob())
    await navigate(PATH_SUPPORT.Settings.issueTypes.root);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={Job?.name || 'New Jobs'} />
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
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <RHFTextField name="name" label="Name*" />
                  <RHFTextField name="slug" label="Slug" />
                  <RHFTextField
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start" >
                          <Iconify icon={icon} sx={{ width: 25, height: 25, color: color || 'black' }} />
                        </InputAdornment>
                      )
                    }}
                    name="icon"
                    label="Icon*"
                  />
                  <RHFColorPicker
                    name="color"
                    label="Color"
                  />
                </Box>
                <RHFTextField name="description" label="Description" minRows={3} multiline />
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <RHFTextField name="displayOrderNo" label="Display Order No." />
                  <Grid display="flex" alignItems="center">
                    {id && (
                      <RHFSwitch name="isActive" label="Active" />
                    )}
                    <RHFSwitch name="isDefault" label="Default" />
                  </Grid>
                </Box>
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
