import * as Yup from 'yup';
import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Container } from '@mui/material';
// slice
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { getConfigs } from '../../../../redux/slices/config/config';
import { addDepartment } from '../../../../redux/slices/department/department';
// routes
import { PATH_SETTING } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../../components/hook-form';
// util
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
// constants
import { FORMLABELS } from '../../../../constants/default-constants';

// ----------------------------------------------------------------------

export default function DepartmentAddForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { configs } = useSelector((state) => state.config);


  const defaultValues = useMemo(
    () => ({
      departmentName: '',
      isActive: true,
      isDefault: false,
      forCustomer: false,
    }),
    []
  );

  const defaultDepartmentTypes = useMemo(
    () =>
      configs
        .find((item) => item.name === 'Department_Types')
        ?.value.split(',')
        .map((type) => type.trim()),
    [configs]
  );

  useLayoutEffect(() => {
    dispatch(getConfigs());
  }, [dispatch]);

  const DepartmentSchema = Yup.object().shape({
    departmentName: Yup.string().min(2, 'Name must be at least 2 characters long').max(50).required('Name is required').trim(),
    departmentType: Yup.string().min(2).max(50).required('Type is required').trim(),
    isActive: Yup.boolean(),
    isDefault: Yup.boolean(),
    forCustomer: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(DepartmentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const toggleCancel = () => {
    navigate(PATH_SETTING.departments.list);
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(addDepartment(data));
      reset();
      enqueueSnackbar('Department Added Successfully!');
      navigate(PATH_SETTING.departments.list);
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: `error` });
      console.error(error);
    }
  };
  return (
    <Container maxWidth={false}>
      <StyledCardContainer><Cover name={FORMLABELS.COVER.DEPARTMENTS_ADD}/></StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12} >
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)'}}>
                  <RHFTextField name="departmentName" label="Name*" />
                  <RHFAutocomplete
                    label="Select Department Type*"
                    name="departmentType"
                    options={defaultDepartmentTypes}
                  />
                </Box>
                <Grid display="flex" justifyContent="flex-start">
                  <RHFSwitch name="isActive" label="Active"/>
                  <RHFSwitch name="isDefault" label="Default"/>
                  <RHFSwitch name="forCustomer" label="Customers" />
                </Grid>
                <AddFormButtons settingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
