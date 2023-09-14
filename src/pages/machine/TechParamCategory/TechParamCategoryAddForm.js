import * as Yup from 'yup';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Container } from '@mui/material';
// slice
import { addTechparamcategory } from '../../../redux/slices/products/machineTechParamCategory';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
// util
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
// constants
import { FORMLABELS } from '../../../constants/default-constants';
// ----------------------------------------------------------------------

export default function TechParamCategoryAddForm() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const AddMachineSchema = Yup.object().shape({
    name: Yup.string().max(50).required('Name is required'),
    description: Yup.string().max(2000),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      isActive: true,
      createdAt: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddMachineSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await dispatch(addTechparamcategory(data));
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_MACHINE.machines.settings.technicalParameterCategories.list);
    } catch (error) {
      enqueueSnackbar('Save Failed!', { variant: `error` });

      console.error(error);
    }
  };
  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.technicalParameterCategories.list);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="New Parameter Category" icon="ic:round-class" />
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
                  <RHFTextField name="name" label="Name*"  />
                  <RHFTextField name="description" label="Description" minRows={7} multiline />
                  <ToggleButtons name={FORMLABELS.isACTIVE.name} isMachine />
                </Box>
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
