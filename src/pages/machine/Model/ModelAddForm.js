import * as Yup from 'yup';
import { useLayoutEffect, useMemo, useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
// import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// form
// import Select from "react-select";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
// import { LoadingButton } from '@mui/lab';
import {
  TextField,
  Autocomplete,
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Container,
} from '@mui/material';
// slice
import { addMachineModel } from '../../../redux/slices/products/model';
import { getActiveCategories } from '../../../redux/slices/products/category';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// import { useSettingsContext } from '../../../components/settings';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
// auth
// import { useAuthContext } from '../../../auth/useAuthContext';
// util
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function ModelAddForm() {
  // const { userId, user } = useAuthContext();

  const { activeCategories } = useSelector((state) => state.category);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [modelVal, setModelVal] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const ModelAddSchema = Yup.object().shape({
    name: Yup.string().trim().max(40).required('Name is required'),
    description: Yup.string().max(2000),
    isActive: Yup.boolean(),
    // category: Yup.string().required('Category is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      isActive: true,
      // category: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(ModelAddSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const values = watch();

  useLayoutEffect(() => {
    dispatch(getActiveCategories());
  }, [dispatch]);

  useEffect(() => {
    if (modelVal && modelVal._id) {
      setValue('category', modelVal._id);
    }
  }, [modelVal, setValue]);

  const onSubmit = async (data) => {
    // console.log("data : ",data)
    //  await dispatchReqAddAndList(dispatch, addMachineModel(data),  reset, navigate, PATH_MACHINE.machineModel.list, enqueueSnackbar)
    try {
      const response = await dispatch(addMachineModel(data));
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_MACHINE.machines.settings.model.view(response.data.MachineModel._id));
    } catch (error) {
      if (error.Message) {
        enqueueSnackbar(error.Message, { variant: `error` });
      } else if (error.message) {
        enqueueSnackbar(error.message, { variant: `error` });
      } else {
        enqueueSnackbar('Something went wrong!', { variant: `error` });
      }
      console.log('Error:', error);
    }
  };
  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.model.list);
  };

  // const { themeStretch } = useSettingsContext();
  
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
                  <Autocomplete
                    value={modelVal || null}
                    options={activeCategories}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setModelVal(newValue);
                    }}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField {...params} label="Category*" />}
                    ChipProps={{ size: 'small' }}
                  />

                  <RHFTextField name="name" label="Name*"/>

                  <RHFTextField name="description" label="Description" minRows={7} multiline />

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
