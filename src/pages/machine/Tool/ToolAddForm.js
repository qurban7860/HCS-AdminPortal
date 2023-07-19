import PropTypes from 'prop-types';
import * as Yup from 'yup';
import axios from 'axios';
import { useLayoutEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Container,
  Checkbox,
  DialogTitle,
  Dialog,
  InputAdornment,
} from '@mui/material';
// slice
import { addTool } from '../../../redux/slices/products/tools';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
import { useSettingsContext } from '../../../components/settings';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// util
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
// ----------------------------------------------------------------------

export default function ToolAddForm() {
  const { userId, user } = useAuthContext();

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
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  // useLayoutEffect(() => {
  //   dispatch(getSPContacts());
  // }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      await dispatch(addTool(data));
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_MACHINE.machines.settings.tool.list);
      // console.log(PATH_MACHINE.tool.list)
    } catch (error) {
      // enqueueSnackbar('Saving failed!');
      enqueueSnackbar(error?.message, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.tool.list);
  };

  const { themeStretch } = useSettingsContext();
  return (
    <>
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
                    <RHFSwitch
                      name="isActive"
                      labelPlacement="start"
                      label={
                        <>
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
                        </>
                      }
                    />
                  </Box>
                </Stack>

                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </FormProvider>
    </>
  );
}
