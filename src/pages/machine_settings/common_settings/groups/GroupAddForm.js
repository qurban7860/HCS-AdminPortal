import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Container } from '@mui/material';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
// redux
import { addGroup } from '../../../../redux/slices/products/group';
import { getActiveCategories } from '../../../../redux/slices/products/category';
// routes
import { PATH_MACHINE } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFAutocomplete, RHFSwitch, RHFTextField } from '../../../../components/hook-form';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';


// ----------------------------------------------------------------------

export default function GroupAddForm() {
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

  const AddGroupSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Name is required').max(50, 'Maximum 50 characters').required('Name is required'),
    categories: Yup.array().min(1, 'Category is required').nullable('Category is required').required('Category is required'),
    isActive: Yup.boolean(),
    isDefault: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(AddGroupSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.groups.list);
  };

  const onSubmit = async (data) => {
    data.categories = data.categories.map(category => category._id);
    try {
      await dispatch(addGroup(data));
      reset();
      enqueueSnackbar('Group Added Successfully!');
      navigate(PATH_MACHINE.machines.settings.groups.list);
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: `error` });
      console.error(error);
    }
  };
  return (
    <Container maxWidth={false}>
      <StyledCardContainer><Cover name="New Machine Group"/></StyledCardContainer>
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
                  <RHFTextField name="name" label="Group Name*" />
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
                <AddFormButtons machineSettingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
