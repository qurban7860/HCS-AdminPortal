import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
// import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Container, Box } from '@mui/material';
// routes
import { PATH_SUPPORT } from '../../../routes/paths';
// slice
import { addProject } from '../../../redux/slices/support/project/project';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFEditor } from '../../../components/hook-form';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../components/Defaults/Cover';
// constants
import { FORMLABELS } from '../../../constants/default-constants';
// styles
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { handleError } from '../../../utils/errorHandler';

// ----------------------------------------------------------------------

export const AddProjectSchema = Yup.object().shape({
  name: Yup.string().min(2).max(40).required('Name is required!'),
  description: Yup.string().max(10000),
  customerAccess: Yup.boolean(),
  isActive: Yup.boolean(),
});

export default function ProjectAddForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      customerAccess: false,
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddProjectSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    try {

      await dispatch(addProject(data));
      reset();
      enqueueSnackbar('Project added Successfully!', { variant: `success` });
      navigate(PATH_SUPPORT.projects.root);
    } catch (error) {
      enqueueSnackbar(handleError(error), { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SUPPORT.projects.root);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name='New Project' />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
                >
                  <RHFTextField name="name" label="Name*" />
                </Box>
                <RHFTextField name="description" label="Description" minRows={3} multiline />
                <Grid display="flex" alignItems="center" mt={1}>
                  <RHFSwitch name='customerAccess' label='Customer Access' />
                  <RHFSwitch name='isActive' label='Active' />
                </Grid>
              </Stack>
              <AddFormButtons customerAccess isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container >
  );
}
