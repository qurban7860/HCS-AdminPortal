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
import FormProvider, { RHFTextField, RHFSwitch, RHFEditor } from '../../../../components/hook-form';
import { getArticleCategory, resetArticleCategory, updateArticleCategory } from '../../../../redux/slices/support/supportSettings/articleCategory';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import FormHeading from '../../../../components/DocumentForms/FormHeading';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { FORMLABELS } from '../../../../constants/default-constants';
import { FORMLABELS as formLABELS } from '../../../../constants/document-constants';

// ----------------------------------------------------------------------

export const EditArticleCategorySchema = Yup.object().shape({
  name: Yup.string().min(2).max(40).required('Name is required!'),
  description: Yup.string().max(10000),
  isActive: Yup.boolean(),
});


export default function ArticleCategoryEditForm() {
  
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { articleCategory } = useSelector((state) => state.articleCategory);  
  
  useEffect(() => {
    dispatch(getArticleCategory(id));
    return () => {
      dispatch(resetArticleCategory());
    };
  }, [id, dispatch]);

  const defaultValues = useMemo(
    () => ({
      name: articleCategory?.name || '',
      description: articleCategory?.description || '',
      isActive: articleCategory?.isActive,
    }),
    [articleCategory]);

  const methods = useForm({
    resolver: yupResolver(EditArticleCategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (articleCategory) {
      reset(defaultValues);
    }
  }, [articleCategory, reset, defaultValues]);


  const toggleCancel = () => {
    navigate(PATH_SUPPORT.supportSettings.articleCategories.root);
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateArticleCategory(articleCategory._id, data));
      navigate(PATH_SUPPORT.supportSettings.articleCategories.root);
      enqueueSnackbar('Article Category updated Successfully!');
      reset();
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={defaultValues.name}
          backLink={() => navigate(PATH_SUPPORT.supportSettings.articleCategories.root)}
        />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="name" label="Name" />
                <RHFTextField name="description" label="Description" minRows={3} multiline />
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
