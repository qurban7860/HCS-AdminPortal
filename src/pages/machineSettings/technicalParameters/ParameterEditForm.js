import * as Yup from 'yup';
import { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Card,
  Grid,
  Stack
} from '@mui/material';
// slice
import { updateTechparam } from '../../../redux/slices/products/machineTechParam';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFSwitch,
  RHFChipsInput,
  RHFAutocomplete,
} from '../../../components/hook-form';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function ParameterEditForm() {

  const { techparam } = useSelector((state) => state.techparam);

  const { techparamcategories } = useSelector((state) => state.techparamcategory);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const ParameterEditSchema = Yup.object().shape({
    category: Yup.object().label('Parameter Category').nullable().required(),
    name: Yup.string().max(200).required('Name is required'),
    code: Yup.array().label('Code').max(20)
    .test('codeLength', 'Code must not exceed 200 characters', (value) => !(value && value.some( val => val.length > 200 ))),
    description: Yup.string().max(5000),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      category: techparam?.category || null,
      name: techparam?.name || '',
      code: techparam?.code || [],
      description: techparam?.description || '',
      isActive: techparam.isActive,
      isIniRead: techparam?.isIniRead,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [techparam]
  );
  
  const methods = useForm({
    resolver: yupResolver(ParameterEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (techparam) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ techparam ]);

  const toggleCancel = () => navigate(PATH_MACHINE.machines.machineSettings.technicalParameters.view(id));

  const onSubmit = async (data) => {
    try {
      await dispatch(updateTechparam(data, techparam._id));
      reset();
      enqueueSnackbar('Update success!');
      navigate(PATH_MACHINE.machines.machineSettings.technicalParameters.view(id));
    } catch (err) {
      enqueueSnackbar(err, { variant: `error` });
      console.error(err);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <StyledCardContainer>
        <Cover name="Edit Parameter" icon="ic:round-flare" />
      </StyledCardContainer>
      <Grid container>
        <Grid item xs={18} md={12} >
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
                <RHFAutocomplete
                  disabled
                  name="category"
                  label="Parameter Category"
                  options={techparamcategories}
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
    // </Container>
  );
}
