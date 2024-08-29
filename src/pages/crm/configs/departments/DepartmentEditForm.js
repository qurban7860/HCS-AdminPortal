import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack } from '@mui/material';
// slice
import { updateDepartment } from '../../../../redux/slices/department/department';
// routes
import { PATH_SETTING } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../../components/hook-form';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { FORMLABELS } from '../../../../constants/default-constants';
// ----------------------------------------------------------------------

export default function DepartmentEditForm() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { department } = useSelector((state) => state.department);
  const [ departmentTypes, setDepartmentTypes ] = useState([])
  
  const defaultValues = useMemo(
    () => ({
      departmentName: department?.departmentName || '',
      departmentType: department?.departmentType || '',
      isActive: department?.isActive,
      isDefault: department?.isDefault || false,
      forCustomer: department?.forCustomer || false,
    }),
    [ department ]
  );
  
  useEffect(() =>{
    const configs = JSON.parse( localStorage.getItem('configurations'))
    const departTypes = configs?.find((item) => item.name === 'Department_Types')?.value.split(',').map((type) => type.trim())
    if(Array.isArray(departTypes) &&  departTypes.length > 0){
      setDepartmentTypes(departTypes)
    }
  }, [ ] );

  const departmentSchema = Yup.object().shape({
    departmentName: Yup.string().min(2).max(50).required('Name is required').trim(),
    departmentType: Yup.string().min(2).max(50).required('Type is required').trim(),
    isActive: Yup.boolean(),
    isDefault: Yup.boolean(),
    forCustomer: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(departmentSchema),
    defaultValues,
  });


  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;


  useEffect(() => {
    if (department) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department]);

  const toggleCancel = () => navigate(PATH_SETTING.departments.view(department?._id));
  
  const onSubmit = async (data) => {
    try {
      await dispatch(updateDepartment(data, id));
      reset();
      enqueueSnackbar('Department Updated Successfully!');
      navigate(PATH_SETTING.departments.view(department?._id));
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };
  return (
    <>
      <StyledCardContainer><Cover name={FORMLABELS.COVER.DEPARTMENTS_EDIT}/></StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}>
                  <RHFTextField name="departmentName" label="Name*" />
                  <RHFAutocomplete
                    label="Department Type*"
                    name="departmentType"
                    options={departmentTypes}
                  />
                  <Grid display="flex">
                    <RHFSwitch name="isActive" label="Active"/>
                    <RHFSwitch name="isDefault" label="Default"/>
                    <RHFSwitch name="forCustomer" label="Customers" />
                  </Grid>
                </Box>
              </Stack>
              <AddFormButtons settingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
