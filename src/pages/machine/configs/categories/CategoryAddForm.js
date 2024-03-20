import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Container } from '@mui/material';
// slice
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { addCategory } from '../../../../redux/slices/products/category';
// schema
import { AddMachineSchema } from '../../../schemas/document';
// routes
import { PATH_MACHINE } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
// auth
// util
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import ToggleButtons from '../../../../components/DocumentForms/ToggleButtons';
// constants
import { FORMLABELS } from '../../../../constants/default-constants';

// ----------------------------------------------------------------------

export default function CategoryAddForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      isActive: true,
      isDefault: false,
      connections: false,
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

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.categories.list);
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(addCategory(data));
      reset();
      enqueueSnackbar('Category created successfully!');
      navigate(PATH_MACHINE.machines.settings.categories.list);
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: `error` });
      console.error(error);
    }
  };
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name="New Machine Category"
          icon="material-symbols:category-outline"
          url={PATH_MACHINE.machines.settings.categories.list}
        />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12} sx={{ mt: 3 }}>
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
                  <RHFTextField name="description" label="Description" minRows={7} multiline />
                </Box>

                <ToggleButtons
                  isMachine
                  isCONNECTABLE
                  name={FORMLABELS.isACTIVE.name}
                  CONNECTName={FORMLABELS.isCONNECTABLE.name}
                  isDefault
                  defaultName='isDefault'
                />

                <AddFormButtons machineSettingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
