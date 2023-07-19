import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
// slice
import {
  updateCategory,
  setCategoryEditFormVisibility,
  getCategory,
} from '../../../redux/slices/products/category';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function CategoryEditForm() {
  const { error, category } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const EditCategorySchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name is required'),
    description: Yup.string().max(2000),
    isActive: Yup.boolean(),
    connections: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: category?.name || '',
      description: category?.description || '',
      isActive: category.isActive,
      connections: category.connections || false,
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
  const toggleCancel = () => {
    dispatch(setCategoryEditFormVisibility(false));
    navigate(PATH_MACHINE.machines.settings.categories.view(id));
  };
  const onSubmit = async (data) => {
    try {
      await dispatch(updateCategory(data, id));
      reset();
      dispatch(setCategoryEditFormVisibility(false));
      enqueueSnackbar('Update success!');
      navigate(PATH_MACHINE.machines.settings.categories.view(id));
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };
  return (
    <>
      <StyledCardContainer>
        <Cover
          name="Edit Category"
          icon="material-symbols:category-outline"
          url={PATH_MACHINE.machines.settings.categories.list}
        />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
                >
                  <RHFTextField name="name" label="Name*" />
                  <RHFTextField name="description" label="Description" minRows={7} multiline />
                  <Grid display="flex" alignItems="end">
                    <RHFSwitch
                      name="isActive"
                      labelPlacement="start"
                      label={
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mx: 0,
                            width: 1,
                            justifyContent: 'space-between',
                            mb: 0.5,
                            color: 'text.secondary',
                          }}
                        >
                          Active
                        </Typography>
                      }
                    />
                    <RHFSwitch
                      name="connections"
                      labelPlacement="start"
                      label={
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mx: 0,
                            width: 1,
                            justifyContent: 'space-between',
                            mb: 0.5,
                            color: 'text.secondary',
                          }}
                        >
                          Connectable as child
                        </Typography>
                      }
                    />
                  </Grid>
                </Box>
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
