import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
// import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Container, Box, MenuItem } from '@mui/material';
// routes
import { PATH_SUPPORT } from '../../../../routes/paths';
// slice
import { addArticle } from '../../../../redux/slices/support/knowledgeBase/article';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFEditor, RHFAutocomplete, RHFSelect } from '../../../../components/hook-form';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../../components/Defaults/Cover';
// constants
import { FORMLABELS } from '../../../../constants/default-constants';
// styles
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { handleError } from '../../../../utils/errorHandler';
import { getActiveArticleCategories, resetActiveArticleCategories } from '../../../../redux/slices/support/supportSettings/articleCategory';
import { articleStatusOptions } from '../../../../utils/constants';

// ----------------------------------------------------------------------

export const AddArticleSchema = Yup.object().shape({
  title: Yup.string().min(2, 'Title must be at least 2 characters long').max(200, 'Title must be at most 200 characters long').required('Title is required!'),
  description: Yup.string().max(10000),
  category: Yup.object().required().label('Category').nullable(),
  customerAccess: Yup.boolean(),
  isActive: Yup.boolean(),
});

export default function ArticleAddForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { activeArticleCategories } = useSelector((state) => state.articleCategory);

  useEffect(() => {
    dispatch(getActiveArticleCategories());
    return () => {
      dispatch(resetActiveArticleCategories());
    };
  }, [dispatch]);

  const defaultValues = useMemo(
    () => ({
      title: '',
      description: '',
      category: null,
      status:'DRAFT',
      customerAccess: false,
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddArticleSchema),
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

      const response = await dispatch(addArticle(data));
      reset();
      enqueueSnackbar('Article added successfully!', { variant: `success` });
      navigate(PATH_SUPPORT.knowledgeBase.article.view(response?._id));
    } catch (error) {
      enqueueSnackbar(handleError(error), { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SUPPORT.knowledgeBase.article.root);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name='New Article' />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <RHFAutocomplete 
                  name="category" 
                  label="Category" 
                  options={activeArticleCategories} 
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                />
                <RHFTextField name="title" label="Title" inputProps={{ maxLength: 200 }} />
                <RHFEditor name="description" label="Description" />
                <Grid display="flex" alignItems="center" mt={1}>
                  <RHFSwitch name='isActive' label='Active' />
                  <RHFSwitch name='customerAccess' label='Customer Access' />
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
