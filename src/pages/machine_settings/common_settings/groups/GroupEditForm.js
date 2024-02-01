import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Container, Grid, Stack, Typography } from '@mui/material';
// slice
import { getActiveCategories } from '../../../../redux/slices/products/category';
import { getGroup, updateGroup } from '../../../../redux/slices/products/group';
// routes
import { PATH_MACHINE } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../../components/hook-form';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function GroupEditForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { activeCategories } = useSelector((state) => state.category);
  const { group, isLoading } = useSelector((state) => state.group);

  useLayoutEffect(() => {
    dispatch(getActiveCategories());
    dispatch(getGroup(id));
  },[dispatch, id]);

  const defaultValues = useMemo(
    () => ({
      name: group?.name || '',
      categories: group?.categories || [],
      isActive: group.isActive,
      isDefault: group.isDefault,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const EditGroupSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Minimum 2 characters').max(50, 'Maximum 50 characters').required('Name is required'),
    categories: Yup.array().min(1, 'Category is required').nullable('Category is required').required('Category is required'),
    isActive: Yup.boolean(),
    isDefault: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(EditGroupSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.groups.view(id));
  };

  const onSubmit = async (data) => {
    data.categories = data.categories.map(category => category._id);
    try {
      await dispatch(updateGroup(data, id));
      reset();
      enqueueSnackbar('Group Updated Successfully!');
      navigate(PATH_MACHINE.machines.settings.groups.view(id));
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer><Cover name="Edit Machine Group"/></StyledCardContainer>
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
