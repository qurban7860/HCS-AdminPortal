import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import {
  Box,
  Card,
  Grid,
  Stack,
  Container,
  TextField,
  Autocomplete,
} from '@mui/material';
// slice
import { addTechparam } from '../../../../redux/slices/products/machineTechParam';
// routes
import { PATH_MACHINE } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFChipsInput } from '../../../../components/hook-form';
// util
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
// ----------------------------------------------------------------------

export default function ParameterAddForm() {
  const { activeTechParamCategories } = useSelector((state) => state.techparamcategory);

  const dispatch = useDispatch();

  const [paramCategoryVal, setParamCategoryVal] = useState(null);

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const AddMachineParameterSchema = Yup.object().shape({
    name: Yup.string().max(40).required('Name is required'),
    code: Yup.string().max(200).required('Code is required'),
    description: Yup.string().max(5000),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      alias: [],
      description: '',
      isActive: true,
      isIniRead: false,
      createdAt: '',
      code: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddMachineParameterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const values = watch();

  const onSubmit = async (data) => {
    try {
      if (paramCategoryVal) {
        data.category = paramCategoryVal?._id;
      }
      await dispatch(addTechparam(data));
      reset();
      enqueueSnackbar('Parameter created successfully!');
      navigate(PATH_MACHINE.machines.settings.parameters.list);
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };
  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.parameters.list);
  };
  return (
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name="New Parameter" icon="ic:round-flare" />
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
                      required
                      value={paramCategoryVal || null}
                      options={activeTechParamCategories}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, newValue) => {
                        setParamCategoryVal(newValue);
                      }}
                      id="controllable-states-demo"
                      renderInput={(params) => <TextField {...params} label="Parameter Category" required />}
                      ChipProps={{ size: 'small' }}
                    />
                  </Box>
                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
                  >
                    <RHFTextField name="name" label="Name*" />
                    <RHFTextField name="code" label="Code*" />
                  </Box>
                  <RHFChipsInput name="alias" label="Alias" />
                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
                  >
                    <RHFTextField name="description" label="Description" minRows={7} multiline />
                    <Grid display="flex" >
                      <RHFSwitch  name="isActive" label="Active" />
                      <RHFSwitch  name="isIniRead" label="Read INI" />
                    </Grid>
                  </Box>
                </Stack>
                <AddFormButtons machineSettingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
  );
}
