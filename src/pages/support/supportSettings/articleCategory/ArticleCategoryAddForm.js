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
import { PATH_SUPPORT } from '../../../../routes/paths';
// slice
import { addArticleCategory } from '../../../../redux/slices/support/supportSettings/articleCategory';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFEditor } from '../../../../components/hook-form';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../../components/Defaults/Cover';
// constants
import { FORMLABELS } from '../../../../constants/default-constants';
// styles
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { handleError } from '../../../../utils/errorHandler';

// ----------------------------------------------------------------------

export const AddArticleCategorySchema = Yup.object().shape({
  name: Yup.string().min(2).max(40).required('Name is required!'),
  description: Yup.string().max(10000),
  isActive: Yup.boolean(),
});

export default function ArticleCategoryAddForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddArticleCategorySchema),
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

      await dispatch(addArticleCategory(data));
      reset();
      enqueueSnackbar('Article Category added Successfully!', { variant: `success` });
      navigate(PATH_SUPPORT.settings.articleCategories.root);
    } catch (error) {
      enqueueSnackbar(handleError(error), { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SUPPORT.settings.articleCategories.root);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name='New Article Category' />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <RHFTextField name="name" label="Name" />
                <RHFTextField name="description" label="Description" minRows={3} multiline />
                <Grid display="flex" alignItems="center" mt={1}>
                  <RHFSwitch name='isActive' label='Active' />
                </Grid>
              </Stack>
              <AddFormButtons settingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container >
  );
}
