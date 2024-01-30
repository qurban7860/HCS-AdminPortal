import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Container, TextField } from '@mui/material';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
// redux
import { addCategoryGroup } from '../../../redux/slices/products/categoryGroup';
import { getActiveCategories } from '../../../redux/slices/products/category';
// schema
import { AddMachineSchema } from '../../schemas/document';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFAutocomplete, RHFSwitch, RHFTextField } from '../../../components/hook-form';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import ToggleButtons from '../../../components/DocumentForms/ToggleButtons';
// constants
import { FORMLABELS } from '../../../constants/default-constants';

// ----------------------------------------------------------------------

export default function CategoryGroupAddForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { activeCategories } = useSelector((state) => state.category);

  useLayoutEffect(() => {
    dispatch(getActiveCategories());
  },[dispatch]);

  const defaultValues = useMemo(
    () => ({
      name: '',
      categories: [],
      isActive: true,
      isDefault: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const AddCategoryGroupSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Name is required').max(50, 'Maximum 50 characters').required('Name is required'),
    categories: Yup.array().min(1, 'Category is required').nullable('Category is required').required('Category is required'),
    isActive: Yup.boolean(),
    isDefault: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(AddCategoryGroupSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.categoryGroups.list);
  };

  const onSubmit = async (data) => {
    data.categories = data.categories.map(category => category._id);
    try {
      await dispatch(addCategoryGroup(data));
      reset();
      enqueueSnackbar('Category Group Added Successfully!');
      navigate(PATH_MACHINE.machines.settings.categoryGroups.list);
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: `error` });
      console.error(error);
    }
  };
  return (
    <Container maxWidth={false}>
      <StyledCardContainer><Cover name="New Category Group"/></StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12} >
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(1, 1fr)',
                  }}
                >
                  <RHFTextField name="name" label="Name*" />
                  <RHFAutocomplete
                    multiple
                    name="categories"
                    label="Categories*"
                    // filterSelectedOptions
                    disableCloseOnSelect
                    options={activeCategories}
                    getOptionLabel={(option) => `${option?.name || ''}`}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  />
                </Box>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(6, 1fr)',
                    md: 'repeat(8, 1fr)',
                    lg: 'repeat(10, 1fr)',
                  }}
                >
                <RHFSwitch key='isActive' name="isActive" label="Active" />
                <RHFSwitch key='isDefault' name="isDefault" label="Default" />
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
