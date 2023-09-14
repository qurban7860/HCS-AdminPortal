import * as Yup from 'yup';
import { useEffect,  useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import {
  TextField,
  Autocomplete,
  Box,
  Card,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
// global

// slice
import { updateTechparam } from '../../../redux/slices/products/machineTechParam';

// import { useSettingsContext } from '../../../components/settings';
// import { CONFIG } from '../../../config-global';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// import Iconify from '../../../components/iconify/Iconify';
// import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import FormProvider, {
  RHFTextField,
  RHFSwitch,
} from '../../../components/hook-form';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function ParameterEditForm() {
  const { techparam } = useSelector((state) => state.techparam);

  const { techparamcategories } = useSelector((state) => state.techparamcategory);

  const [paramVal, setParamVal] = useState(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const ParameterEditSchema = Yup.object().shape({
    name: Yup.string().max(40).required('Name is required'),
    description: Yup.string().max(2000),
    isActive: Yup.boolean(),
    code: Yup.string().max(20).required('Code is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: techparam?.name || '',
      code: techparam?.code || '',
      description: techparam?.description || '',
      isActive: techparam.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [techparam]
  );
  // const { themeStretch } = useSettingsContext();
  const methods = useForm({
    resolver: yupResolver(ParameterEditSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const values = watch();

  // useLayoutEffect(() => {
  //   dispatch(getTechparam(id));
  // }, [dispatch, id]);

  useEffect(() => {
    if (techparam) {
      reset(defaultValues);
    }
    setParamVal(techparam.category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [techparam]);

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.parameters.view(id));
  };

  const onSubmit = async (data) => {
    try {
      if (paramVal !== null && paramVal !== '') {
        data.category = paramVal?._id;
      }
      console.log('Submit Data : ', data);
      await dispatch(updateTechparam(data, techparam._id));
      reset();
      enqueueSnackbar('Update success!');
      navigate(PATH_MACHINE.machines.settings.parameters.view(id));
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  return (
    // <Container maxWidth={false }>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <StyledCardContainer>
        <Cover name="Edit Parameter" icon="ic:round-flare" />
      </StyledCardContainer>
      <Grid container>
        <Grid item xs={18} md={12} sx={{ mt: 3 }}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              
                <Autocomplete
                  disabled
                  value={paramVal || null}
                  options={techparamcategories}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    setParamVal(newValue);
                  }}
                  id="controllable-states-demo"
                  renderInput={(params) => <TextField {...params} label="Parameter Category" required />}
                  ChipProps={{ size: 'small' }}
                />
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <RHFTextField name="name" label="Name*" />
                <RHFTextField name="code" label="Code*" />
              </Box>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
              >
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
                      {' '}
                      Active
                    </Typography>
                  }
                />
              </Box>
            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
    // </Container>
  );
}
