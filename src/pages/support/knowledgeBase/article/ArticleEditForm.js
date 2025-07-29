import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Card,
  Grid,
  Stack,
  Container
} from '@mui/material';
// routes
import { PATH_SUPPORT } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFEditor, RHFAutocomplete } from '../../../../components/hook-form';
import { updateArticle } from '../../../../redux/slices/support/knowledgeBase/article';
import { getActiveArticleCategories, resetArticleCategory } from '../../../../redux/slices/support/supportSettings/articleCategory';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { handleError } from '../../../../utils/errorHandler';

// ----------------------------------------------------------------------

export const EditArticleSchema = Yup.object().shape({
  title: Yup.string().min(2, 'Title must be at least 2 characters long').max(200, 'Title must be at most 200 characters long').required('Title is required!'),
  description: Yup.string().max(50000),
  category: Yup.object().required().label('Category').nullable(),
  customerAccess: Yup.boolean(),
  isActive: Yup.boolean(),
});

export default function ArticleEditForm() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { article } = useSelector((state) => state.article); 
  const { activeArticleCategories } = useSelector((state) => state.articleCategory); 
  
  useEffect(() => {
    dispatch(getActiveArticleCategories());
    return () => {
      dispatch(resetArticleCategory());
    };
  }, [dispatch]);

  const defaultValues = useMemo(
    () => ({
      title: article?.title || '',
      description: article?.description || '',
      category: article?.category || null,
      customerAccess: article?.customerAccess,
      isActive: article?.isActive,
    }),
    [article]);

  const methods = useForm({
    resolver: yupResolver(EditArticleSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);


  const toggleCancel = () => {
    navigate(PATH_SUPPORT.knowledgeBase.article.root);
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateArticle(article._id, data));
      navigate(PATH_SUPPORT.knowledgeBase.article.view(article._id));
      enqueueSnackbar('Article updated successfully!', { variant: `success` });
      reset();
    } catch (error) {
      enqueueSnackbar(handleError(error), { variant: `error` });
      console.error(error);
    }
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Edit Article" />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFAutocomplete 
                  name="category" 
                  label="Category" 
                  options={activeArticleCategories} 
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                />
                <RHFTextField name="title" label="Title" inputProps={{ maxLength: 200 }} />
                <RHFEditor name="description" label="Description" />
                <Grid display='flex' alignItems="center" mt={1} >
                  <RHFSwitch name='isActive' label='Active' />
                  <RHFSwitch name='customerAccess' label='Customer Access' />
                </Grid>
              </Stack>
              <AddFormButtons settingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
