import * as Yup from 'yup';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
// import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Container,
  // Checkbox,
  // DialogTitle,
  // Dialog,
  // InputAdornment,
} from '@mui/material';
// slice
import { addTool } from '../../../../redux/slices/products/tools';
// routes
import { PATH_MACHINE } from '../../../../routes/paths';
// import { useSettingsContext } from '../../../components/settings';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../../components/hook-form';
// auth
// import { useAuthContext } from '../../../auth/useAuthContext';
// util
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
// ----------------------------------------------------------------------

export default function ToolAddForm() {
  // const { userId, user } = useAuthContext();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const AddMachineSchema = Yup.object().shape({
    name: Yup.string().max(50).required('Name is required'),
    description: Yup.string().max(5000),
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
      await dispatch(addTool(data));
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_MACHINE.machines.settings.tool.list);
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.tool.list);
  };

  return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Container maxWidth={false}>
          <StyledCardContainer>
            <Cover name="New Tool" icon="fa-solid:tools" />
          </StyledCardContainer>
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
                    <RHFTextField name="name" label="Name" required />
                    <RHFTextField name="description" label="Description" minRows={7} multiline />
                    <RHFSwitch name="isActive" label="Active" />
                  </Box>
                </Stack>

                <AddFormButtons machineSettingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </FormProvider>
  );
}
