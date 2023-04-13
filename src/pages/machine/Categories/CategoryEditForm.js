import * as Yup from 'yup';
import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Container, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
// slice
import { updateCategory, setEditFormVisibility, getCategory, getCategories } from '../../../redux/slices/products/category';
// routes
import { PATH_MACHINE, PATH_DASHBOARD } from '../../../routes/paths';
// components
import {useSnackbar} from '../../../components/snackbar'
import FormProvider, {  RHFTextField, RHFSwitch} from '../../../components/hook-form';
import {Cover} from '../../components/Cover'
// ----------------------------------------------------------------------

export default function CategoryEditForm() {

  const { error, category } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const EditCategorySchema = Yup.object().shape({
    name: Yup.string().min(5).max(50).required('Name is required') ,
    description: Yup.string().max(2000),
    isActive : Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
        name:category?.name || 'N/A',
        description:category?.description || 'N/A',
        isActive: category.isActive ,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category]
  );
  const methods = useForm({
    resolver: yupResolver(EditCategorySchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useLayoutEffect(() => {
    dispatch(getCategory(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (category) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);
  const toggleCancel = () => 
    {
      dispatch(setEditFormVisibility(false));
      navigate(PATH_MACHINE.categories.view(id));
    };
  const onSubmit = async (data) => {
    try {
      await dispatch(updateCategory(data,id));
      reset(); 
      dispatch(setEditFormVisibility(false))
      enqueueSnackbar('Update success!');
     navigate(PATH_MACHINE.categories.view(id));
    } catch (err) {
      enqueueSnackbar('Saving failed!');
      console.error(error);
    }
  };
  return (
    <>
      <Helmet>
        <title> Machine: Edit Category | Machine ERP</title>
      </Helmet>
        <Card sx={{ mb: 3, height: 160, position: 'relative' }} >
          <Cover name='Edit Category' icon='material-symbols:category-outline' url={PATH_MACHINE.categories.list} />
        </Card>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', }} >
                <RHFTextField name="name" label="Machine Category" required />
                <RHFTextField name="description" label="Description" minRows={7} multiline />
                <RHFSwitch name="isActive" labelPlacement="start" label={
                  <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography> } 
                />
              </Box>
            </Stack>
              <Box rowGap={5} columnGap={4} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(5, 1fr)', }} > 
                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>Save Changes</LoadingButton>
                <Button  onClick={toggleCancel} variant="outlined"  size="large">Cancel</Button>
              </Box>
          </Card>
        </Grid>
      </FormProvider>
    </>
  );
}
