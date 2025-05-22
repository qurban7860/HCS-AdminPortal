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
import { PATH_SUPPORT } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFEditor, RHFAutocomplete } from '../../../../components/hook-form';
import { getArticle, resetArticle, updateArticle } from '../../../../redux/slices/support/knowledgeBase/article';
import { getActiveArticleCategories, resetArticleCategory } from '../../../../redux/slices/support/supportSettings/articleCategory';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { FORMLABELS } from '../../../../constants/default-constants';
import { FORMLABELS as formLABELS } from '../../../../constants/document-constants';

// ----------------------------------------------------------------------

export const EditArticleSchema = Yup.object().shape({
  title: Yup.string().min(2).max(40).required('Name is required!'),
  category: Yup.object().required().label('Article Category').nullable(),
  description: Yup.string().max(10000),
  isActive: Yup.boolean(),
});


export default function ArticleEditForm() {
  
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { article } = useSelector((state) => state.article); 
  const { activeArticleCategories } = useSelector((state) => state.articleCategory); 
  
  useEffect(() => {
    dispatch(getArticle(id));
    dispatch(getActiveArticleCategories());
    return () => {
      dispatch(resetArticle());
      dispatch(resetArticleCategory());
    };
  }, [id, dispatch]);

  const defaultValues = useMemo(
    () => ({
      title: article?.title || '',
      description: article?.description || '',
      category: article?.category || null,
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
    if (article) {
      reset(defaultValues);
    }
  }, [article, reset, defaultValues]);


  const toggleCancel = () => {
    navigate(PATH_SUPPORT.knowledgeBase.article.root);
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateArticle(article._id, data));
      navigate(PATH_SUPPORT.knowledgeBase.article.root);
      enqueueSnackbar('Knowledge Base updated Successfully!');
      reset();
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Edit Article" backLink={() => navigate(PATH_SUPPORT.knowledgeBase.article.root)} />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(1, 1fr 1fr)' }}>
                  <RHFTextField name="title" label="Title" />
                  <RHFAutocomplete 
                    name="category" 
                    label="Article Category" 
                    options={activeArticleCategories} 
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                  />
                </Box>
                <RHFEditor name="description" label="Description" minRows={8} multiline />
                <Grid display='flex' alignItems="center" mt={1} >
                  <RHFSwitch name='isActive' label='Active' />
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
