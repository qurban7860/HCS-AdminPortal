import * as Yup from 'yup';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import {
  Card,
  Grid,
  Stack,
  Container,
} from '@mui/material';
// slice
import { addTechparam } from '../../../redux/slices/products/machineTechParam';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete, RHFSwitch, RHFChipsInput } from '../../../components/hook-form';
// util
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
// ----------------------------------------------------------------------

export default function ParameterAddForm() {
  const { activeTechParamCategories } = useSelector((state) => state.techparamcategory);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const AddMachineParameterSchema = Yup.object().shape({
    category: Yup.object().label('Parameter Category').nullable().required(),
    name: Yup.string().max(200).required('Name is required'),
    code: Yup.array().label('Code').max(20)
    .test('codeLength', 'Code must not exceed 200 characters', (value) => !(value && value.some( val => val.length > 200 ))),
    description: Yup.string().max(5000),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      category: null,
      name: '',
      code: [],
      description: '',
      isActive: true,
      isIniRead: false,
      createdAt: '',
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

  const onSubmit = async (data) => {
    try {
      await dispatch(addTechparam(data));
      reset();
      enqueueSnackbar('Parameter created successfully!');
      navigate(PATH_MACHINE.machines.machineSettings.technicalParameters.root);
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };
  const toggleCancel = () => navigate(PATH_MACHINE.machines.machineSettings.technicalParameters.root);

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
                    <RHFAutocomplete
                      name="category"
                      label="Parameter Category"
                      options={activeTechParamCategories}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => option.name}
                    />
                    <RHFTextField name="name" label="Name*" />
                    <RHFChipsInput name="code" label="Code*" />
                    <RHFTextField name="description" label="Description" minRows={7} multiline />

                    <Grid display="flex" >
                      <RHFSwitch  name="isActive" label="Active" />
                      <RHFSwitch  name="isIniRead" label="Read INI" />
                    </Grid>
                </Stack>
                <AddFormButtons machineSettingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
  );
}
