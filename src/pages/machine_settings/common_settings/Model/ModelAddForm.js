import {  useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Container } from '@mui/material';
// slice
import { addMachineModel } from '../../../../redux/slices/products/model';
import { getActiveCategories, resetActiveCategories } from '../../../../redux/slices/products/category';
// routes
import { PATH_MACHINE } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../../components/hook-form';
import { ModelSchema } from './schemas/ModelSchema';
// util
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function ModelAddForm() {

  const { activeCategories } = useSelector((state) => state.category);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      name: '',
      category: null,
      description: '',
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(ModelSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    dispatch(getActiveCategories());
    return () => { dispatch(resetActiveCategories())}
  }, [dispatch]);

  useEffect(() => { 
    setValue('category',activeCategories.find((cat) => cat.isDefault) ) 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ activeCategories ])

  const onSubmit = async (data) => {
    try {
      await dispatch(addMachineModel(data));
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_MACHINE.machines.settings.model.list);
    } catch (error) {
        enqueueSnackbar(error, { variant: `error` });
      console.log('Error:', error);
    }
  };

  const toggleCancel = () => { navigate(PATH_MACHINE.machines.settings.model.list) };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="New Model" icon="material-symbols:model-training-outline-rounded" />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12} sx={{ mt: 3 }}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
                >
                  <RHFAutocomplete
                    name="category"
                    label="Category*"
                    options={activeCategories}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => option.name}
                    id="controllable-states-demo"
                    ChipProps={{ size: 'small' }}
                  />

                  <RHFTextField name="name" label="Name*"/>

                  <RHFTextField name="description" label="Description" minRows={7} multiline />
                <Grid display="flex">
                  <RHFSwitch name="isActive" label="Active"/>
                  <RHFSwitch name="isDefault" label="Default"/>
                </Grid>
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
